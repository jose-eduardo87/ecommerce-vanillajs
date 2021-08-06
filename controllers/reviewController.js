const Review = require("./../models/reviewModel");
const {
  createOne,
  readAll,
  readOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");

exports.setUserAndProductId = (req, res, next) => {
  // FOR NESTED ROUTES
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }

  next();
};

exports.createReview = createOne(Review);
exports.readAllReviews = readAll(Review);
exports.readOneReview = readOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
