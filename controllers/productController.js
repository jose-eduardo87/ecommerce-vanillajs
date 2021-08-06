const Product = require("../models/productModel");
const {
  createOne,
  readAll,
  readOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");

exports.createProduct = createOne(Product);
exports.readAllProducts = readAll(Product);
exports.readOneProduct = readOne(Product, { path: "reviews" });
exports.updateProduct = updateOne(Product);
exports.deleteProduct = deleteOne(Product);
