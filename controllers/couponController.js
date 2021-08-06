const Coupon = require("./../models/couponModel");
const {
  createOne,
  readAll,
  readOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");

exports.readOneCoupon = catchAsync(async (req, res, next) => {
  const { userId, codeName, id } = req.params;

  // TRIGGERED ONLY IF ADMIN IS USING IT

  if (id) {
    const coupon = await Coupon.findById(id);

    return res.status(200).json({
      status: "success",
      data: coupon,
    });
  }

  const coupon = await Coupon.findOne({ code: codeName });

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
