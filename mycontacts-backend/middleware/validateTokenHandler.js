const asyncHandler = require('express-async-handler'); //express-async-handler
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler( async(req, res, next) => {
  let token;

  // authHeader holds the auth type, space, & accessToken
  let authHeader = req.headers.Authorization || req.headers.authorization; 
  if(authHeader && authHeader.startsWith("Bearer"))
  {
    //extract the access token
    token = authHeader.split(" ")[1];
    jwt.verify(token,process.env.ACESS_TOKEN_SECRET, (err, decoded)=>{
      if(err){
        res.status(401)
        throw new Error ("user is not valid")
      } 
      req.user = decoded.user;
      next();
    });

    if(!token){
      res.status(401)
      throw new error("user is not authorized or token is missing")
    }
  }
});

module.exports = validateToken;