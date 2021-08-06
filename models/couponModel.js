const { Types, Schema, model } = require("mongoose");
const Cart = require("./cartModel");

const couponSchema = new Schema({
  code: {
    type: String,
    required: [true, "Please provide a code name for this coupon."],
    minlength: 4,
    maxlength: 8,
  },
  discountPercent: {
    type: Number,
    required: [true, "Please provide the discount in percent for this coupon."],
    min: 1,
    max: 100,
  },
  expiresIn: {
    type: Date,
    required: [true, "Please provide an expiry date."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// APPLIES DISCOUNT ON CART

couponSchema.methods.applyCouponOnCart = async (userId, couponId) => {
  // const cartCoupon = await Cart.aggregate([
  //   {
  //     $match: { user: Types.ObjectId(userId) },
  //   },
  // ]);

  // const cart = await Cart.findOneAndUpdate(
  //   { user: userId },
  //   {
  //     $set: {
  //       "discount.$.coupon": couponId,
  //       "discount.$.appliedIn": Date.now(),
  //     },
  //   }
  // );

  const cart = await Cart.findOne({ user: userId });

  console.log(cart);
};

const Coupon = model("Coupon", couponSchema);

module.exports = Coupon;
