const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
  username: String,
  user:{
    firstName: String,
    lastName: String
  },
  password: String,
  about: String,
  facebookId: String,
  googleId: String,
  twitterId: String,
  email: {
      type: String,
      required: false,
      lowercase: true,
      minlength: 1,
      unique: true
    },
  image: String,
  blog: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: "Blog"
     }],

});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema)
