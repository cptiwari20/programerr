const mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
  title: String,
  body: {
    type: String,
    required: true
  },
  category: String,
  image: String,
  date: {type: Date, default: Date.now},
  comments:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  author: {
     id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
     },
     username: String
  }
});

module.exports = mongoose.model("Blog", blogSchema)
