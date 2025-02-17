const express = require("express");
const books = require("../database/books"); // Import books collection

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// POST /api/books - Add a new book
app.post("/api/books", async (req, res) => {
  try {
    console.log("Incoming POST request:", req.body);

    const { id, title, author } = req.body;

    if (!title) {
      console.log("Missing book title - returning 400 error");
      return res.status(400).json({ message: "Book title is required" });
    }

    const newBook = { id, title, author };
    const result = await books.insertOne(newBook); // Use collection method to insert

    console.log("Book added successfully:", result);
    res.status(201).json({ message: "Book added successfully" });
  } catch (error) {
    console.error("Error adding book:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/books/:id - Delete a book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    console.log(`Incoming DELETE request for book ID: ${bookId}`);

    const result = await books.deleteOne({ id: bookId }); // Use collection method to delete

    console.log("Book deleted successfully:", result);
    res.status(204).send(); // No content response
  } catch (error) {
    console.error("Error deleting book:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/books/:id - Update a book
app.put("/api/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;

    // Validate if the ID is a number
    if (isNaN(bookId)) {
      console.log("Invalid book ID - must be a number");
      return res.status(400).json({ error: "Input must be a number" });
    }

    const { title, author } = req.body;

    // Check if the title is provided
    if (!title) {
      console.log("Missing book title - returning 400 error");
      return res.status(400).json({ error: "Bad Request: Book title is required" });
    }

    const updatedBook = { title, author };
    const result = await books.updateOne({ id: parseInt(bookId) }, updatedBook);

    console.log("Book updated successfully:", result);
    res.status(204).send(); // No content response
  } catch (error) {
    console.error("Error updating book:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
