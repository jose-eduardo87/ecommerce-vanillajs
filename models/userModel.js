const { randomBytes, createHash } = require("crypto");
const { Schema, model } = require("mongoose");
const { compare, hash } = require("bcryptjs");
const { isEmail } = require("validator");
const Cart = require("./cartModel");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name."],
      minlength: 5,
      maxlength: 25,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Tell us your best e-mail! "],
      trim: true,
      validate: [isEmail, "Please provide a valid e-mail."],
    },
    password: {
      type: String,
      select: false,
      required: [true, "Create a strong and unique password."],
      minlength: 6,
      maxlength: 16,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Confirm your password."],
      minlength: 6,
      maxlength: 16,
      validator: {
        validate: function (pwdConfirm) {
          return pwdConfirm === this.password;
        },
        message: "Passwords do not match.",
      },
    },
    cartTotal: Number,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordExpiresAt: Date,
  }
  // NEEDED IN CASE WE USE VIRTUALS ON THE MODEL
  // {
  //   toObject: { virtuals: true },
  //   toJSON: { virtuals: true },
  // }
);

// POPULATE VIRTUAL - NOT VERY USEFUL BECAUSE IT WILL ONLY BE ACCESSIBLE FOR ADMINS
// REMINDER THAT IN ORDER TO POPULATE VIRTUALS WORK, IT'S MANDATORY TO HAVE toObject: { virtuals: true } AND
// toJSON: { virtuals: true } AND A .populate() ON THE ROUTE HANDLER.

// userSchema.virtual("cart", {
//   ref: "Cart",
//   foreignField: "user",
//   localField: "_id",
// });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// CREATES A CART DOCUMENT AFTER AN USER DOCUMENT IS CREATED. USEFUL BECAUSE NOW
// ALL THE INFORMATION RELATED TO CART (LIKE value, hasCoupon) WILL BE INSIDE
// OF THE CART DOCUMENT, EVEN WHEN USER HASN'T ADDED ANY ITEMS TO THE CART

userSchema.post("save", async function () {
  await Cart.create({ user: this._id });
});

userSchema.methods.comparePasswords = async function (candidatePwd, userPwd) {
  return compare(candidatePwd, userPwd);
};

userSchema.methods.generateResetToken = async function () {
  const token = randomBytes(32).toString("hex");

  this.passwordResetToken = createHash("sha256").update(token).digest("hex");
  this.passwordExpiresAt = Date.now() + 10 * 60 * 1000;
  await this.save({ validateBeforeSave: false });

  return token;
};

userSchema.methods.hasChangedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedDate = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedDate;
  }

  return false;
};

const User = model("User", userSchema);

module.exports = User;
