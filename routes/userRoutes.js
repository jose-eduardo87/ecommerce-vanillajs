const router = require("express").Router();
const {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("./../controllers/authController");
const {
  getMe,
  updateMe,
  deleteMe,
  createUser,
  readAllUsers,
  readOneUser,
  updateUser,
  deleteUser,
} = require("./../controllers/userController");
const cartRouter = require("./cartRoutes");
const wishlistRouter = require("./wishlistRoutes");

router.post("/signup", signup);
router.post("/login", login);

router.use(protect);

/////////// ALL BELOW ROUTES ARE PROTECTED DUE TO router.use(protect) ///////////

///// NESTED ROUTES: USER ROUTES NOW HAVE ACCESS TO CART AND WISHLIST ROUTES /////

router.use("/:userId/carts", cartRouter);
router.use("/:userId/wishlists", wishlistRouter);

router.post("/forgot-password", forgotPassword);
router.patch("/update-password", updatePassword);
router.post("/reset-password/:token", resetPassword);
router.route("/me").get(getMe).patch(updateMe).delete(deleteMe);

router.use(restrictTo("admin"));

/////////// ADMIN-ONLY ROUTES ///////////

router.route("/").post(createUser).get(readAllUsers);
router.route("/:id").get(readOneUser).patch(updateUser).delete(deleteUser);

module.exports = router;
