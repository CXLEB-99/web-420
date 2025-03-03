const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("./database/users");
const Collection = require("./database/collection");
const booksDB = require("./database/books");

const app = express();
app.use(bodyParser.json());

const saltRounds = 10;
const SECRET_KEY = "your_secret_key";

app.post("/api/books", async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: "Book title and author are required" });
    }

    const result = await booksDB.insertOne({ title, author });
    const newBook = result.ops[0];
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/api/books/:id", async (req, res) => {
  try {
    const bookId = parseInt(req.params.id, 10);
    const { title, author } = req.body;

    if (isNaN(bookId)) {
      return res.status(400).json({ message: "Invalid book ID provided" });
    }

    const book = await booksDB.findOne({ id: bookId });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!title) {
      return res.status(400).json({ message: "Book title is required" });
    }

    await booksDB.updateOne({ id: bookId }, { title, author: author || book.author });
    const updatedBook = await booksDB.findOne({ id: bookId });
    console.log("Book updated:", updatedBook);
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  try {
    const bookId = parseInt(req.params.id, 10);
    if (isNaN(bookId)) {
      return res.status(400).json({ message: "Invalid book ID provided" });
    }

    const result = await booksDB.deleteOne({ id: bookId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: `Book with ID ${bookId} not found` });
    }

    console.log(`Book with ID ${bookId} deleted`);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Incoming login request:", req.body);

    if (!email || !password) {
      throw Object.assign(new Error("Bad Request"), { status: 400 });
    }

    const user = await users.findOne({ email });
    if (!user) {
      throw Object.assign(new Error("Unauthorized"), { status: 401 });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      console.log("Incorrect password for email:", email);
      throw Object.assign(new Error("Unauthorized"), { status: 401 }); // Fixed typo here
    }

    console.log("Authentication successful");
    res.status(200).send("Authentication successful");
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
