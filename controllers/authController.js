const { promisify } = require("util");
const { createHash } = require("crypto");
const { sign, verify } = require("jsonwebtoken");
const User = require("./../models/userModel");
const AppError = require("./../utils/AppError");
const catchAsync = require("./../utils/catchAsync");
const Email = require("./../utils/Email");

const signToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendToken = (user, res, statusCode) => {
  user.password = undefined;
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  sendToken(newUser, res, 201);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePasswords(password, user.password))) {
    return next(new AppError("E-mail and/or password do not match.", 401));
  }

  sendToken(user, res, 200);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    [, token] = req.headers.authorization.split(" ");
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // console.log(req.headers.authorization);

  if (token === "null") {
    return next(
      new AppError(
        "You are not logged in. Log in to get access to your account.",
        401
      )
    );
  }

  const decoded = await promisify(verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("User does not belong to this database anymore.", 401)
    );
  }

  if (currentUser.hasChangedPassword(decoded.iat)) {
    return next(
      new AppError(
        "User recently changed their password. Log in again to get access.",
        401
      )
    );
  }

  req.user = currentUser;

  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const token = req.cookies.jwt;

      const decoded = await promisify(verify)(token, process.env.JWT_SECRET);

      const currentUser = await User.findById(decoded.id).populate("cart");

      if (!currentUser) {
        return next();
      }

      if (currentUser.hasChangedPassword(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;

      return next();
    } catch (err) {
      return next();
    }
  }

  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppErrror("Please provide your e-mail!", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      status: "success",
      message:
        "If we find your e-mail in this database, we will send a reset password e-mail. Please check your e-mail.",
    });
  }

  try {
    const token = await user.generateResetToken();
    const URL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/forgot-password/${token}`;

    await new Email(user, URL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "E-mail sent to the user.",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "We are facing some internal error. Please try again later.",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password, passwordConfirm } = req.body;
  const hashedToken = createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() + 10 * 60 * 1000 },
  }).select("+password");

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  sendToken(user, res, 200);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, newPassword, newPasswordConfirm } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.comparePasswords(passwordCurrent, user.password))) {
    return next(new AppError("Wrong password.", 401));
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save();

  sendToken(user, res, 200);
});
