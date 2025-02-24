const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("./database/users");
const Collection = require("./database/collection");
const booksDB = require("./database/books"); // Import the mock books database

const app = express();
app.use(bodyParser.json());

const saltRounds = 10;
const SECRET_KEY = "your_secret_key"; // Replace with a secure key

// Mock Database for Books
const books = new Collection([
  { id: 1, title: "Test Book", author: "John Doe" },
]);

app.post("/api/books", async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: "Book title and author are required" });
    }

    const newBook = await booksDB.addBook({ title, author }); // Use the mock database function
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a book
app.put("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  const { title, author } = req.body;

  if (isNaN(bookId)) {
    return res.status(400).json({ message: "Invalid book ID provided" });
  }

  const book = books.items.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!title) {
    return res.status(400).json({ message: "Book title is required" });
  }

  book.title = title;
  book.author = author || book.author;
  console.log("Book updated:", book);
  return res.status(200).json(book);
});

// Delete a book
app.delete("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  if (isNaN(bookId)) {
    return res.status(400).json({ message: "Invalid book ID provided" });
  }

  const bookIndex = books.items.findIndex((b) => b.id === bookId);
  if (bookIndex === -1) {
    return res.status(404).json({ message: `Book with ID ${bookId} not found` });
  }

  books.items.splice(bookIndex, 1);
  console.log(`Book with ID ${bookId} deleted`);
  return res.status(204).send();
});

// User login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Incoming login request:", req.body);

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    console.log("Incorrect password for email:", email);
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log("Authentication successful");
  const token = jwt.sign({ email: user.email, id: user.id }, SECRET_KEY, { expiresIn: "1h" });
  return res.status(200).json({ message: "Authentication successful", token });
});

// Start the server (only if running directly, not in Jest tests)
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
