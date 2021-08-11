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

// METHOD ACCESSIBLE ON COUPON DOCUMENTS. FINDS THE USER'S CART AND UPDATE 
// THE DOCUMENT WITH DISCOUNT DATA

couponSchema.methods.applyCouponOnCart = async (userId, couponId) => {
  const cart = await Cart.findOne({ user: userId });
  cart.discount = { coupon: couponId, appliedIn: Date.now() };
  
  await cart.save();
}

const Coupon = model("Coupon", couponSchema);

module.exports = Coupon;
