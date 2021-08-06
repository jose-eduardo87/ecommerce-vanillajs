const { Schema, model } = require("mongoose");
const AppError = require("../utils/AppError");

const cartSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
    unique: true,
    required: [true, "A cart must have an user."],
  },
  cart: [
    {
      product: {
        type: Schema.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      size: {
        type: String,
        enum: [
          "S",
          "M",
          "L",
          "XL",
          "34",
          "35",
          "36",
          "37",
          "38",
          "39",
          "40",
          "41",
          "42",
          "small",
          "average",
          "large",
        ],
      },
      color: String,
    },
  ],
  value: Number,
  discount: {
    coupon: {
      type: Schema.ObjectId,
      ref: "Coupon",
    },
    appliedIn: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// INSTANCE METHOD TO UPDATE value FIELD EVERY TIME THERE IS A NEW
// INSERTION, UPDATE OR DELETION OF ANY CART DOCUMENT
cartSchema.statics.calculateCartValue = async function (cartId) {
  const cartPrice = await this.aggregate([
    {
      $match: { _id: cartId },
    },
    {
      $unwind: "$cart",
    },
    {
      $lookup: {
        from: "products",
        localField: "cart.product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        _id: 0,
        total: { $multiply: ["$cart.quantity", "$product.price"] },
      },
    },
    {
      $group: {
        _id: null,
        value: { $sum: "$total" },
      },
    },
  ]);

  // FOR UPDATING THE CURRENT CART DOCUMENT, WE MUST USE .updateOne() BECAUSE IT WON'T TRIGGER THE pre/post MIDDLEWARES BELOW.
  // BY USING .findByIdAndUpdate() FOR EXAMPLE, WOULD ENTER IN A LOOP BECAUSE IT WOULD TRIGGER .post(/^findOneAnd/) WHICH WOULD CALL
  // THIS METHOD OVER AND OVER.

  if (cartPrice.length > 0) {
    const [{ value }] = cartPrice;

    await Cart.updateOne({ _id: cartId }, { value: value.toFixed(2) });
  } else {
    await Cart.updateOne({ _id: cartId }, { value: 0 });
  }
};

cartSchema.pre(/^find/, function (next) {
  // THE SECOND .populate() IS RESPONSIBLE TO POPULATE THE "product" SUBDOCUMENT. FIRST WE POPULATE THE
  // ARRAY WHERE THE SUBDOCUMENT IS LOCATED AND THEN WE POPULATE AGAIN
  this.populate({ path: "user", select: "name" }).populate({
    path: "cart",
    populate: {
      path: "product",
      select: "name size color price quantity slug images",
    },
  });

  next();
});

// CHECK THIS LATER
// Checks if the selected amount of items in the cart is equal or less than the total
// cartSchema.pre("save", async function (next) {
//   const totalAvailable = await Product.findById(this.product).select(
//     "quantity"
//   );

//   if (this.quantity > totalAvailable) {
//     return next(
//       new AppError(
//         `There are ${totalAvailable} available items for this item!`,
//         400
//       )
//     );
//   }

//   next();
// });

cartSchema.post("save", async function () {
  // THIS POINTS TO THE CURRENT CART DOCUMENT
  await this.constructor.calculateCartValue(this._id);
});

const Cart = model("Cart", cartSchema);

module.exports = Cart;
