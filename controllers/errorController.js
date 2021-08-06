const AppError = require("./../utils/AppError");

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  res.status(500).json({
    status: "error",
    message: "Something went wrong. Please try again later.",
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const handleDuplicateFields = (err) => {
  let message;

  if (Object.keys(err.keyValue)[0] === "product") {
    message = `You have already selected this item! ERRCODE: ${
      Object.values(err.keyValue)[0]
    }`;
  }

  // USELESS FOR NOW
  // Object.keys(err.keyValue).forEach((field) =>
  //   message.push(err.keyValue[field])
  // );

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const message = [];

  Object.keys(err.errors).forEach((field) => message.push(err.errors[field]));

  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "status";

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }

  let errCopy = Object.assign({}, err);

  if (errCopy.kind === "ObjectId") {
    errCopy = handleCastErrorDB(errCopy);
  }
  if (errCopy.code === 11000) {
    errCopy = handleDuplicateFields(errCopy);
  }
  if (errCopy.errors) {
    errCopy = handleValidationErrorDB(errCopy);
  }

  sendErrorProd(errCopy, res);
};
