const mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  commentText: String,
  author: {
       id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
       },
       userName: String,
  },
  image: String,
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Comment", commentSchema)
