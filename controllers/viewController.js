const Product = require("./../models/productModel");
const Cart = require("./../models/cartModel");
const Query = require("./../utils/Query");
const catchAsync = require("./../utils/catchAsync");

const queryDocument = async (filterObject, queryOptions) => {
  const setQuery = () => {
    let queryObject = {};

    Object.keys(queryOptions).forEach(
      (field) => (queryObject[field] = queryOptions[field])
    );

    return queryObject;
  };

  const query = new Query(Product.find(filterObject), setQuery())
    .filter()
    .sort()
    .select()
    .paginate();

  return await query.query;
};

const pageNotFound = (res) => {
  return res.status(404).render("404", {
    title: "Ooooops!",
    message:
      "We couldn't find the product you are looking for. Please check if the URL specified is spelled correctly.",
  });
};

exports.getHome = catchAsync(async (req, res, next) => {
  const bestSellers = await queryDocument(
    {},
    {
      sort: "ratingsAverage,createdAt",
      select: "name,slug,price,images,sex",
      limit: 6,
    }
  );
  const newArrivals = await queryDocument(
    {},
    {
      sort: "-createdAt",
      select: "name,slug,price,images,sex",
      limit: 6,
    }
  );

  res.status(200).render("home", { title: "Home", bestSellers, newArrivals });
});

exports.getSearch = (req, res) => {
  res.status(200).render("products", {
    title: "Results",
    category: "Search",
    isSearch: true,
  });
};

exports.getLogin = (req, res) => {
  res.status(200).render("login & signup", { title: "Login & Signup" });
};

exports.getAbout = (req, res) => {
  res.status(200).render("about", { title: "About" });
};

exports.getCart = async (req, res, next) => {
  res.status(200).render("cart & wishlist", {
    title: "Your cart",
    pageTitle: "Cart",
  });
};

exports.getCheckout = (req, res) => {
  res.status(200).render("checkout", { title: "Checkout" });
};

exports.getContact = (req, res) => {
  res.status(200).render("contact", { title: "Contact" });
};

exports.get404 = (req, res) => {
  res.status(404).render("404", { title: "Oh nooooo!" });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", { title: "Your account" });
};

exports.getWishlist = (req, res) => {
  res.status(200).render("cart & wishlist", {
    title: "Your wishlist",
    pageTitle: "Wishlist",
  });
};

exports.getProducts = (req, res) => {
  const category = req.params.sex.replace(/^\w/, (c) => c.toUpperCase());

  res.status(200).render("products", {
    title: `Items for ${category}`,
    category,
  });
};

exports.getProduct = async (req, res, next) => {
  const { sex, slug } = req.params;

  const product = await Product.findOne({ slug, sex }).populate({
    path: "reviews",
  });

  if (!product) {
    return pageNotFound(res);
  }

  res.status(200).render("product", { title: product.name, product });
};
