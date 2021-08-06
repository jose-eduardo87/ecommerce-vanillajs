const router = require("express").Router();
const {
  createProduct,
  readAllProducts,
  readOneProduct,
  updateProduct,
  deleteProduct,
} = require("./../controllers/productController");
const { setQueryMiddleware } = require("./../middlewares/setQuery");
const { protect, restrictTo } = require("./../controllers/authController");
const reviewRouter = require("./reviewRoutes");

// NESTED ROUTE: PRODUCTS HAVE ACCESS TO ITS REVIEWS
router.use("/:product/reviews", reviewRouter);

router.get("/search", setQueryMiddleware, readAllProducts);
router.get("/:sex/:category", readAllProducts);
router.get("/:sex", setQueryMiddleware, readAllProducts);
router.get("/", readAllProducts);
router.get("/:id", readOneProduct);

router.use(protect, restrictTo("admin"));

router.post("/", createProduct);
router.route("/:id").patch(updateProduct).delete(deleteProduct);

module.exports = router;
