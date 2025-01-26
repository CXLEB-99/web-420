/**
 * Author: Caleb Goforth
 * Date: 1/25/2025
 * File Name: app.js
 * Description: In-N-Out-Books server setup and configuration
 */

const express = require('express');
const app = express();

// Set the port for the server
const PORT = 3000;


app.get('/', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>In-N-Out-Books</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
              text-align: center;
          }
          h1 {
              color: #333;
          }
          p {
              color: #555;
          }
      </style>
  </head>
  <body>
      <h1>Welcome to In-N-Out-Books!</h1>
      <p>Your platform for managing your book collections.</p>
  </body>
  </html>`;
  res.send(html);
});

app.use((req, res, next) => {
  res.status(404).send('404: Page Not Found');
});

app.use((err, req, res, next) => {
  const errorResponse = {
      message: err.message,
      // Include the stack trace in development mode
      stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  };
  res.status(500).json(errorResponse);
});

module.exports = app;

