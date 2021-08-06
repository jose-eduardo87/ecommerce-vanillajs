const router = require("express").Router({ mergeParams: true });
const {
  readAllCarts,
  readOneCart,
  updateCart,
  deleteCart,
} = require("./../controllers/cartController");
const { protect } = require("./../controllers/authController");

router.use(protect);

router.route("/").get(readAllCarts).patch(updateCart);
router.route("/:cartId/").get(readOneCart).delete(deleteCart);
router.route("/product/:productId").delete(deleteCart);

module.exports = router;
