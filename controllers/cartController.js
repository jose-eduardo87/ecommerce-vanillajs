const Cart = require("./../models/cartModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.readAllCarts = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const carts = await Cart.findOne({ user: userId });

  res.status(200).json({
    status: "success",
    data: carts,
  });
});

exports.readOneCart = catchAsync(async (req, res, next) => {
  const { userId, cartId } = req.params;

  const cartByUser = await Cart.findOne({ user: userId });

  const cart = cartByUser.cart.id(cartId);

  res.status(200).json({
    status: "success",
    data: cart,
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const updates = req.body;
  const userCart = await Cart.findOne({ user: userId });

  updates.forEach(({ id, size, color, quantity, product }) => {
    const currentItem = userCart.cart.id(id);

    // IF RUNS WHEN THERE IS A PATCH TRIGGER ON '/cart'
    if (currentItem) {
      currentItem.size = size;
      currentItem.color = color;
      currentItem.quantity = quantity;
      // ELSE RUNS WHEN THERE IS A PATCH TRIGGER ON '/'
    } else {
      userCart.cart.push({ product });
    }
  });

  userCart.save();

  res.status(200).json({
    status: "success",
    data: userCart,
  });
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  const { userId, cartId, productId } = req.params;

  const userCart = await Cart.findOne({ user: userId });
  let deletedCartId = cartId;

  if (productId) {
    userCart.cart.forEach((item) => {
      if (item.product.id === productId) {
        deletedCartId = item.id;
      }
    });
  }

  userCart.cart.id(deletedCartId).remove();

  userCart.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
