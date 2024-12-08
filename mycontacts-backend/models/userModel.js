const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userName : {
    type: String,
    required : [true, "Please add user name"]
  },
  email : {
    type: String,
    required : [true, "Please add email"],
    unique : [true, "This email address has already been registered"]
  },
  password : {
    type: String,
    required : [true, "Please add password"]
  }
},{ 
    timestamp: true
});

module.exports = mongoose.model("User", userSchema);