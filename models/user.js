const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({

  username:{
    type: String,
    required: true,
    minlength: 1,
  },
  password: String,

});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema)
// firstName: {
//   type: String,
//   required : true
// },
// lastName: {
//   type: String,
//   required : true
// },  // email: {
  //   type: String,
  //   required: false,
  //   lowercase: true,
  //   minlength: 1,
  //   unique: true
  // },
  // image: String,
  // blog: [{
  //    type: mongoose.Schema.Types.ObjectId,
  //    ref: "Blog"
  //  }],
  // date: Date
