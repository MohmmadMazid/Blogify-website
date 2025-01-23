const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./userSchema.js");

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  commnetedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Comments = mongoose.model("Comments", commentSchema);

module.exports = Comments;
