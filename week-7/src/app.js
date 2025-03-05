const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Ajv = require("ajv");
const users = require("./database/users");
const Collection = require("./database/collection"); // Note: Unused in current routes
const booksDB = require("./database/books");

const app = express();
app.use(bodyParser.json());

const saltRounds = 10;
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; // For future JWT use

// AJV setup for security question validation
const ajv = new Ajv({ allErrors: true });
const securityQuestionSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      answer: { type: "string" },
    },
    required: ["answer"],
    additionalProperties: false,
  },
  minItems: 3,
  maxItems: 3,
};

// Book Routes
app.post("/api/books", async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: "Book title and author are required" });
    }

    const result = await booksDB.insertOne({ title, author });
    const newBook = result.ops ? result.ops[0] : result; // Handle mock vs real DB
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

// User Routes
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Incoming login request:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      console.log("Incorrect password for email:", email);
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Authentication successful");
    res.status(200).json({ message: "Authentication successful" }); // JSON response
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/users/:email/verify-security-question", async (req, res) => {
  try {
    const { email } = req.params;
    const answers = req.body;

    const validate = ajv.compile(securityQuestionSchema);
    if (!validate(answers)) {
      return res.status(400).json({ message: "Invalid security question answers" });
    }

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const savedQuestions = user.securityQuestions;
    if (answers.length !== savedQuestions.length) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const allMatch = answers.every((answerObj, index) => {
      return answerObj.answer === savedQuestions[index].answer;
    });

    if (!allMatch) {
      console.log("Security answers do not match for email:", email);
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Security questions verified for email:", email);
    res.status(200).json({ message: "Security questions successfully answered" });
  } catch (error) {
    console.error("Security question error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Default Route (for landing page)
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the In-N-Out Books API" });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;