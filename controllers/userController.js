const User = require("./../models/userModel");
const {
  readAll,
  readOne,
  updateOne,
  deleteOne,
} = require("./../controllers/handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/AppError");

const updatesFilter = (updateObject, ...allowedUpdates) => {
  const filteredUpdates = {};

  allowedUpdates.map((field) => {
    if (updateObject[field]) {
      filteredUpdates[field] = updateObject[field];
    }
  });

  return filteredUpdates;
};

exports.getMe = async (req, res, next) => {
  const { id } = req.user;

  const me = await User.findById(id);

  res.status(200).json({
    status: "success",
    data: me,
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route does not update passwords. Use /update-password instead.",
        400
      )
    );
  }

  const { id } = req.user;
  const filteredBody = updatesFilter(req.body, "name", "email");

  const user = await User.findByIdAndUpdate(id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  await User.findByIdAndUpdate(id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

/////////// ADMIN-ONLY ROUTE HANDLERS ///////////

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    active: req.body.active,
  });

  res.status(201).json({
    status: "success",
    data: newUser,
  });
});

exports.readAllUsers = readAll(User);
// exports.readOneUser = readOne(User, { path: "cart" });
exports.readOneUser = readOne(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
