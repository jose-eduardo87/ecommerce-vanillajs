const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  review: {
    type: String,
    required: [true, "Please provide a brief review about this product."],
    trim: true,
    minlength: 10,
    maxlength: 250,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: [true, "A review must belong to an user."],
  },
  product: {
    type: Schema.ObjectId,
    ref: "Product",
    required: [true, "A review must belong to a product."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

reviewSchema.pre(/^find/, function (next) {
  // NEEDS TO CHECK PERFORMANCE, TWO .populate() MAY IMPACT PERFORMANCE NEGATIVELY
  this.populate({ path: "user", select: "name photo" });
  //     .populate({
  //   path: "product",
  //   select: "name",
  // });

  next();
});

const Review = model("Review", reviewSchema);

module.exports = Review;
