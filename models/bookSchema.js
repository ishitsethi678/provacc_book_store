const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  bookId: {
    type: Number,
    required: true,
  },
  bookName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
