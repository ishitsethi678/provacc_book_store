const express = require("express");
const router = express.Router();
const Book = require("../models/bookSchema");

//-----For entering book data-------
router.post("/books", async (req, res) => {
  const { image, bookId, bookName, description, price } = req.body;
  try {
    if (!image || !bookId || !bookName || !description || !price) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    let existingBook = await Book.find({
      bookName: bookName,
      bookId: bookId,
    });

    if (existingBook.length > 0) {
      return res.status(409).json({ error: "Book already exists" });
    }
    const book = new Book({ image, bookId, bookName, description, price });
    await book.save();
    return res.status(200).json({ message: "Book saved successfully", book });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//-----For getting book data-------
router.get("/getbooks", async (req, res) => {
  try {
    const book = await Book.find();
    return res.status(200).json({ book });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Internal server error" });
  }
});

//-----For deleting book data-------
router.delete("/deletebook", async (req, res) => {
  const { bookId } = req.query;
  try {
    const existingBook = await Book.findOneAndDelete(bookId);
    if (!existingBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//------for editing book name------
router.post("/editbookname", async (req, res) => {
  const { bookId, newBookName } = req.body;
  try {
    const updatedBook = await Book.findOneAndUpdate(
      { bookId: bookId },
      { $set: { bookName: newBookName } }, // Use 'bookName' instead of 'newBookName'
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res
      .status(200)
      .json({ message: "Book updated successfully", updatedBook });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
});

//----for searching books by name-----
router.get("/searchbyname", async (req, res) => {
  const { bookName } = req.query;
  try {
    const books = await Book.find({
      bookName: { $regex: new RegExp(bookName, "i") },
    });
    if (books.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.status(200).json({ books });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
