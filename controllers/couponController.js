const Coupon = require("./../models/couponModel");
const {
  createOne,
  readAll,
  updateOne,
  deleteOne,
} = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require('./../utils/AppError');

exports.readOneCoupon = catchAsync(async (req, res, next) => {
  const sendCouponNotFound = () => next(new AppError('We could not find this coupon on our database.', 404));
  const { userId, codeName, id } = req.params;

  // TRIGGERED ONLY IF ADMIN IS USING IT
  if (id) {
    const coupon = await Coupon.findById(id);

    if(!coupon) {
      return sendCouponNotFound();
    }

    return res.status(200).json({
      status: "success",
      data: coupon,
    });
  }

  const coupon = await Coupon.findOne({ code: codeName });

  if(!coupon) {
    return sendCouponNotFound();
  }

  // APPLIES DISCOUNT BY FILLING THE FIELD "discount" WITH COUPON ID AND TIMESTAMP ON USER'S CART DOCUMENT
  await coupon.applyCouponOnCart(userId, coupon._id);

  res.status(200).json({
    status: "success",
    data: coupon,
  });
});

exports.createCoupon = createOne(Coupon);
exports.readAllCoupons = readAll(Coupon);
exports.updateCoupon = updateOne(Coupon);
exports.deleteCoupon = deleteOne(Coupon);
