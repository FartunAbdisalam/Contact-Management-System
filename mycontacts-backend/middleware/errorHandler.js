// intercept the response to handle error and return the err.res as json
const {constants} = require('../constants');
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case constants.VALIDATION_ERROR :
      res.json({
        title: "validation Failed", 
        message : err.message, 
        stackTrace: err.stack
      });
      break;
    case constants.NOT_FOUND : 
     res.json({
        title: "Not Found", 
        message : err.message, 
        stackTrace: err.stack
    });
    case constants.UNAUTHORIZED : 
    res.json({
       title: "Unauthorized", 
       message : err.message, 
       stackTrace: err.stack
     });
    case constants.FORBIDEN : 
    res.json({
       title: "Forbiden", 
       message : err.message, 
       stackTrace: err.stack
     });
     case constants.SERVER_ERROR :
      res.json({
        title: "Server Error", 
        message: err.message,
        stackTrace: err.stack});
        break;
    default:
      console.log("No error found. All good");
      break;
  }
  // res.json({message : err.message, stackTrace: err.stack})
}

module.exports = errorHandler;