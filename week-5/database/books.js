/**
 * Author: Professor Krasso
 * Date: 4/1/2024
 * File Name: books.js
 * Description: Books collection file for the in-n-out-books application; used to store book data
 */

// Only import MongoClient if we're not running in a test environment
const { MongoClient } = process.env.NODE_ENV === 'test' ? {} : require('mongodb');
const Collection = require('./collection');

// Mock book data (used in test environment)
const books = new Collection([
  { id: 1, title: "The Fellowship of the Ring", author: "J.R.R. Tolkien" },
  { id: 2, title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling" },
  { id: 3, title: "The Two Towers", author: "J.R.R. Tolkien" },
  { id: 4, title: "Harry Potter and the Chamber of Secrets", author: "J.K. Rowling" },
  { id: 5, title: "The Return of the King", author: "J.R.R. Tolkien" },
]);

const find = async () => {
  return books.find();
};

const findOne = async (id) => {
  return books.findOne({ id });
};

// Mock insertOne method for adding a book
const insertOne = async (book) => {
  // Ensure books is treated as an array in the mock environment
  if (!Array.isArray(books.data)) {
    books.data = [];
  }
  books.data.push(book);  // Adds the book to the mock collection
  return { result: { ok: 1, n: 1 }, ops: [book] };  // Mock response similar to MongoDB's insertOne
};

// Mock deleteOne method for deleting a book
const deleteOne = async (query) => {
  if (!Array.isArray(books.data)) {
    books.data = [];
  }
  const index = books.data.findIndex(book => book.id === query.id);
  if (index !== -1) {
    books.data.splice(index, 1);  // Removes the book from the collection
    return { result: { ok: 1, n: 1 }, deletedCount: 1 };  // Mock response for delete
  }
  return { result: { ok: 1, n: 0 }, deletedCount: 0 };  // If no matching book is found
};

// Add the missing `updateOne` method for updating books
const updateOne = async (query, update) => {
  if (!Array.isArray(books.data)) {
    books.data = [];
  }
  const bookIndex = books.data.findIndex(book => book.id === query.id);
  if (bookIndex === -1) {
    return { result: { ok: 0, n: 0 }, modifiedCount: 0 };
  }

  // Update the book in the collection
  books.data[bookIndex] = { ...books.data[bookIndex], ...update };
  return { result: { ok: 1, n: 1 }, modifiedCount: 1 };
};

module.exports = { find, findOne, insertOne, deleteOne, updateOne };

