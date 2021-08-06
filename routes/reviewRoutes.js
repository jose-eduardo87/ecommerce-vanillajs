const router = require("express").Router({ mergeParams: true });
const {
  setUserAndProductId,
  createReview,
  readAllReviews,
  readOneReview,
  updateReview,
  deleteReview,
} = require("./../controllers/reviewController");
const { protect, restrictTo } = require("./../controllers/authController");

router.use(protect);

router
  .route("/")
  .post(setUserAndProductId, createReview)
  .get(restrictTo("admin"), readAllReviews);
router
  .route("/:id")
  .get(readOneReview)
  .patch(updateReview)
  .delete(restrictTo("admin"), deleteReview);

module.exports = router;
