const router = require("express").Router();
const {
  getHome,
  getSearch,
  getLogin,
  getAbout,
  getCart,
  getCheckout,
  getContact,
  get404,
  getAccount,
  getWishlist,
  getProducts,
  getProduct,
} = require("./../controllers/viewController");
const { protect, isLoggedIn } = require("./../controllers/authController");

router.get("/", isLoggedIn, getHome);
router.get("/login", isLoggedIn, getLogin);
router.get("/about", isLoggedIn, getAbout);
router.get("/cart", protect, isLoggedIn, getCart);
router.get("/checkout", protect, isLoggedIn, getCheckout);
router.get("/contact", isLoggedIn, getContact);
router.get("/404", isLoggedIn, get404);
router.get("/account", isLoggedIn, getAccount);
router.get("/wishlist", isLoggedIn, getWishlist);
// router.get(["/products", "/products/:sex", "/products/:sex/:category"], isLoggedIn, getProducts); // IT DIDN'T WORK. NEEDS FURTHER INVESTIGATION
router.get("/products/", isLoggedIn, getProducts);
router.get("/products/search", isLoggedIn, getSearch);
router.get("/products/:sex", isLoggedIn, getProducts);
router.get("/products/:sex/:category", isLoggedIn, getProducts);
router.get("/product/:sex/:slug", isLoggedIn, getProduct);

module.exports = router;
