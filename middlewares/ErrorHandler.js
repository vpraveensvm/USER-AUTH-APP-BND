const {
  VALIDATION_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  SERVER_ERROR,
} = require("../constants");

//Error-handling middleware always takes four arguments.
// You must provide four arguments to identify it as an error-handling middleware function.
// Even if you don’t need to use the next object, you must specify it to maintain the signature.
// Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.

const errorHandler = (err, req, res, next) => {
  const responseStatus = res.statusCode || 500;
  const errMessage = err.message;
  const errStack = err.stack;

  switch (responseStatus) {
    case VALIDATION_ERROR:
      res.status(responseStatus).json({
        title: "Validation error",
        message: errMessage,
        stack: errStack,
      });
      break;

    case UNAUTHORIZED:
      res.status(responseStatus).json({
        title: "UNAUTHORIZED",
        message: errMessage,
        stack: errStack,
      });
      break;

    case FORBIDDEN:
      res.status(responseStatus).json({
        title: "FORBIDDEN",
        message: errMessage,
        stack: errStack,
      });
      break;

    case NOT_FOUND:
      res.status(responseStatus).json({
        title: "NOT_FOUND",
        message: errMessage,
        stack: errStack,
      });
      break;
    case SERVER_ERROR:
      res.status(responseStatus).json({
        title: "SERVER_ERROR",
        message: errMessage,
        stack: errStack,
      });
      break;

    default:
      res.status(responseStatus).json({
        title: "UNKNOWN ERROR",
        message: errMessage,
        stack: errStack,
      });
      break;
  }
};

module.exports = errorHandler;
