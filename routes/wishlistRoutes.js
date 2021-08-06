const router = require("express").Router({ mergeParams: true });
const {
  createWishlist,
  readAllWishlists,
  readOneWishlist,
  updateWishlist,
  deleteWishlist,
} = require("./../controllers/wishlistController");
const { protect } = require("./../controllers/authController");

router.use(protect);

router.route("/").post(createWishlist).get(readAllWishlists);
router
  .route("/:id")
  .get(readOneWishlist)
  .patch(updateWishlist)
  .delete(deleteWishlist);

module.exports = router;
