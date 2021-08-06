const { Schema, model } = require("mongoose");

const wishlistSchema = new Schema({
  product: {
    type: Schema.ObjectId,
    ref: "Product",
    required: [true, "A wishlist must be populated with items!"],
  },
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: [true, "A wishlist must belong to an user."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Wishlist = model("Wishlist", wishlistSchema);

module.exports = Wishlist;
