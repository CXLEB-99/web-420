/**
 * Author: Professor Krasso
 * Modified by: [Your Name]
 * Date: 4/1/2024 (Updated: 2/23/2025)
 * File Name: books.js
 * Description: Books collection file for in-n-out-books; manages book data with mock storage.
 */

const { MongoClient } = process.env.NODE_ENV === 'test' ? {} : require('mongodb');
const Collection = require('./collection');

// Mock book data for testing
const books = new Collection([
  { id: 1, title: "The Fellowship of the Ring", author: "J.R.R. Tolkien" },
  { id: 2, title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling" },
  { id: 3, title: "The Two Towers", author: "J.R.R. Tolkien" },
  { id: 4, title: "Harry Potter and the Chamber of Secrets", author: "J.K. Rowling" },
  { id: 5, title: "The Return of the King", author: "J.R.R. Tolkien" },
]);

// Find all books
const find = async () => books.find();

// Find a single book by query
const findOne = async (query) => books.findOne(query);

// Insert a new book with auto-generated ID
const insertOne = async (book) => {
  const maxId = books.data.length ? Math.max(...books.data.map(b => b.id)) + 1 : 1;
  const newBook = { id: maxId, ...book };
  return books.insertOne(newBook);
};

// Update a book by query
const updateOne = async (query, update) => books.updateOne(query, update);

// Delete a book by query
const deleteOne = async (query) => books.deleteOne(query);

module.exports = { find, findOne, insertOne, updateOne, deleteOne };
