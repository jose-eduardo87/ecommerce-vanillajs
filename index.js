const path = require("path");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const viewRouter = require("./routes/viewRoutes");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const couponRouter = require("./routes/couponRoutes");
const cartRouter = require("./routes/cartRoutes");
const wishlistRouter = require("./routes/wishlistRoutes");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/AppError");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests. Try again in one hour.",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: ["price", "brand", "ratingsAverage", "ratingsQuantity"],
  })
);

app.use(compression());

app.use("/", viewRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/wishlists", wishlistRouter);

app.all("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return next(
      new AppError(
        `We could not reach to ${req.originalUrl} on this server.`,
        404
      )
    );
  }

  res.status(404).render("404", {
    title: "Ooooops!",
    message:
      "We couldn't find the product you are looking for. Please check if the URL specified is spelled correctly.",
  });
});

app.use(globalErrorHandler);

module.exports = app;
