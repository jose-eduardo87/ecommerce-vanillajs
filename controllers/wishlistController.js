const Wishlist = require("./../models/wishlistModel");
const {
  createOne,
  readAll,
  readOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");

exports.createWishlist = createOne(Wishlist);
exports.readAllWishlists = readAll(Wishlist);
exports.readOneWishlist = readOne(Wishlist);
exports.updateWishlist = updateOne(Wishlist);
exports.deleteWishlist = deleteOne(Wishlist);
