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
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f4f4f9;
          color: #333;
        }
        header {
          background: #4caf50;
          color: white;
          padding: 1rem 0;
          text-align: center;
        }
        nav {
          background: #333;
          color: white;
          padding: 0.5rem 0;
          text-align: center;
        }
        nav a {
          color: white;
          text-decoration: none;
          margin: 0 1rem;
        }
        nav a:hover {
          text-decoration: underline;
        }
        main {
          padding: 2rem;
        }
        section {
          margin-bottom: 2rem;
        }
        footer {
          background: #333;
          color: white;
          text-align: center;
          padding: 1rem 0;
          margin-top: 2rem;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Welcome to In-N-Out-Books</h1>
        <p>Your one-stop destination for book lovers!</p>
      </header>
      <nav>
        <a href="#">Home</a>
        <a href="#">Books</a>
        <a href="#">About Us</a>
        <a href="#">Contact</a>
      </nav>
      <main>
        <section>
          <h2>Introduction</h2>
          <p>At In-N-Out-Books, we celebrate the joy of reading. Whether you're an avid reader or just starting your literary journey, we have something for everyone.</p>
        </section>
        <section>
          <h2>Top Selling Books</h2>
          <ul>
            <li><strong>The Great Gatsby</strong> by F. Scott Fitzgerald</li>
            <li><strong>1984</strong> by George Orwell</li>
            <li><strong>To Kill a Mockingbird</strong> by Harper Lee</li>
            <li><strong>The Catcher in the Rye</strong> by J.D. Salinger</li>
          </ul>
        </section>
        <section>
          <h2>Hours of Operation</h2>
          <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
          <p>Saturday: 10:00 AM - 6:00 PM</p>
          <p>Sunday: Closed</p>
        </section>
        <section>
          <h2>Contact Information</h2>
          <p>Email: info@in-n-out-books.com</p>
          <p>Phone: (555) 123-4567</p>
          <p>Address: 123 Book Lane, Read City, RC 12345</p>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 In-N-Out-Books. All Rights Reserved.</p>
      </footer>
    </body>
    </html>
  `;
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

