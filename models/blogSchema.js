const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./userSchema");
const Comments = require("./commentSchema");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ImageUrl1: {
    type: String,
    default:
      "https://www.usnews.com/object/image/00000169-5e06-df95-a57d-7ec6abfb0000/5-taj-mahal-getty.jpg?update-time=1706734280787&size=responsive970",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1708534419572-6e6614a53ca1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGFkZWlzJTIwa3VydGl8ZW58MHx8MHx8fDA%3D"
        : v,
  },
  ImageUrl2: {
    type: String,
    default:
      "https://www.usnews.com/object/image/00000169-5e06-df95-a57d-7ec6abfb0000/5-taj-mahal-getty.jpg?update-time=1706734280787&size=responsive970",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1708534419572-6e6614a53ca1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGFkZWlzJTIwa3VydGl8ZW58MHx8MHx8fDA%3D"
        : v,
  },
  ImageUrl3: {
    type: String,
    default:
      "https://www.usnews.com/object/image/00000169-5e06-df95-a57d-7ec6abfb0000/5-taj-mahal-getty.jpg?update-time=1706734280787&size=responsive970",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1708534419572-6e6614a53ca1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGFkZWlzJTIwa3VydGl8ZW58MHx8MHx8fDA%3D"
        : v,
  },
  intro: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
});

const BLOG = mongoose.model("BLOG", blogSchema);

module.exports = BLOG;
