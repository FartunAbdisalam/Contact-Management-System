const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel")

//@desc register a user
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler( async(req, res) => {
  // destructure the info given
  const {userName, email, password} = req.body;
  //check any empty fields
  if(!userName || !email || !password)
  {
    res.status(400);
    throw new Error("All fields are mandatory")
  }
  //check if user exists
  const userExist = await User.findOne({email});
  if(userExist){
    res.status(400);
    throw new Error("This email already exists")
  }
  // hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // console.log("Hashed password : ",hashedPassword);

  //create user
  const user = await User.create({
    userName,
    email,
    password: hashedPassword
  });
  if (user)
  {
    res.status(201).json({_id : user.id, email: user.email});
  }else{
    res.status(400);
    throw new Error("User data is not valid")
  }
  //  res.json({massage: "register route"})
});

//@desc login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async(req, res) => {
  res.json({massage: "login route"})
});

//@desc current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async(req, res) =>{
  res.json({massage: "current user information"})
})



module.exports = {registerUser, loginUser, currentUser}
