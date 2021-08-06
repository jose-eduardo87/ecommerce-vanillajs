const router = require("express").Router();
const {
  createCoupon,
  readAllCoupons,
  readOneCoupon,
  updateCoupon,
  deleteCoupon,
} = require("./../controllers/couponController");
const { protect, restrictTo } = require("./../controllers/authController");

router.use(protect);

// THIS IS THE ONLY ROUTE AVAILABLE TO THE USER, THAT'S WHY I DIDN'T MERGE COUPON IN USER ROUTES

router.get("/user/:userId/code/:codeName", readOneCoupon);

router.use(protect, restrictTo("admin"));

// ALL THE ROUTES BELOW ARE ONLY ACCESSIBLE BY THE ADMIN

router.route("/").post(createCoupon).get(readAllCoupons);
router
  .route("/:id")
  .get(readOneCoupon)
  .patch(updateCoupon)
  .delete(deleteCoupon);

module.exports = router;
