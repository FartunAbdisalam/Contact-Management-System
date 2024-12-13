const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
  const {email, password} = req.body;
  // check any empty fields 
  if(!email || !password){
    res.status(400);
    throw new Error("All fields are Mandatory");
  }
  // check if user exists in the Database
  const user = await User.findOne({email})

  //compare the password given by the user and the hashed password in the DB 
  if(user && (await bcrypt.compare(password, user.password)))
  {
    //if user exists & passwords match
    // provide an acess token to the user to log in
    const acessToken = jwt.sign(
      {
      user:{
        username: user.userName,
        email: user.email,
        id: user.id
      }
    },
    process.env.ACESS_TOKEN_SECRET,
    {expiresIn: "1m"}
  );
    res.status(200).json({acessToken});
  }else{
    res.status(401);
    throw new Error("email or password is not valid")
  }
  // res.json({massage: "login route"})
});

//@desc current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async(req, res) =>{
   res.json(req.user);
})



module.exports = {registerUser, loginUser, currentUser}
