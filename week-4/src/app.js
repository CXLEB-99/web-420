/**
 * Author: Caleb Goforth
 * Date: 1/25/2025
 * File Name: app.js
 * Description: In-N-Out-Books server setup and configuration
 */

const express = require('express');
const app = express();

// Require the books module
const { find, findOne } = require('../database/books.js');

// Middleware to parse JSON
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the In-N-Out-Books API');
});

// GET /api/books - Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/books/:id - Get a single book by ID
app.get('/api/books/:id', async (req, res) => {
  const { id } = req.params;

  // Ensure the id is a number
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Input must be a number' });
  }

  try {
    const book = await findOne(Number(id));

    console.log('Book found:', book);  // Debugging line to log the book

    if (!book) {
      console.log('Book not found');  // Debugging line to log when no book is found
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book:', error);  // Log any server-side errors
    res.status(500).json({ message: error.message });
  }
});

// Error handling middleware for 404
app.use((req, res) => {
  res.status(404).send('404: Page Not Found');
});

// Error handling middleware for 500
app.use((err, req, res, next) => {
  const errorResponse = {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  };
  res.status(500).json(errorResponse);
});

// Set the port for the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
