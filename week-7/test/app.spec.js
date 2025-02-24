const request = require("supertest");
const app = require("../src/app"); // Import your Express app

// -------------------- CHAPTER 4 TESTS --------------------
describe("Chapter 4: API Tests", () => {
  // Test case 1: Adding a book successfully
  it("Should return a 201-status code when adding a new book", async () => {
    const newBook = { title: "Test Book", author: "John Doe" };

    const response = await request(app)
      .post("/api/books")
      .send(newBook);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Test Book");
    expect(response.body.author).toBe("John Doe");
  });

  // Test case 2: Trying to add a book without a title (should fail)
  it("Should return a 400-status code when adding a new book with missing title", async () => {
    const invalidBook = { author: "Jane Doe" };

    const response = await request(app)
      .post("/api/books")
      .send(invalidBook);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Book title and author are required");
  });

  // Test case 3: Deleting a book successfully
  it("Should return a 204-status code when deleting a book", async () => {
    const bookId = 1;

    const response = await request(app)
      .delete(`/api/books/${bookId}`);

    expect(response.status).toBe(204);
  });
});

// -------------------- CHAPTER 5 TESTS --------------------
describe("Chapter 5: API Tests", () => {
  test("Should update a book and return a 200 status code", async () => {
    const response = await request(app)
      .put("/api/books/1")
      .send({ title: "Updated Book Title", author: "Updated Author" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "Updated Book Title"); // Update based on the actual response
    expect(response.body).toHaveProperty("author", "Updated Author");
  });

  test("Should return a 400-status code when using a non-numeric id", async () => {
    const response = await request(app)
      .put("/api/books/foo")
      .send({ title: "Some Book", author: "Author Name" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid book ID provided");
  });

  test("Should return a 400-status code when updating a book with a missing title", async () => {
    const response = await request(app)
      .put("/api/books/1")
      .send({ author: "Author Name" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Book title is required");
  });
});

// -------------------- CHAPTER 6 TESTS --------------------
describe("Chapter 6: API Tests", () => {
  it("Should log a user in and return a 200-status with 'Authentication successful' message", async () => {
    const response = await request(app).post("/api/login").send({
      email: "test@example.com", // Ensure this matches your users.js
      password: "password", // Ensure this matches the hashed password in users.js
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Authentication successful");
    expect(response.body).toHaveProperty("token");
  });

  it("Should return a 401-status code with 'Unauthorized' message when logging in with incorrect credentials", async () => {
    const response = await request(app).post("/api/login").send({
      email: "test@example.com", // Ensure this matches your users.js
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Unauthorized");
  });

  it("Should return a 400-status code with 'Missing email or password' message when missing email or password", async () => {
    const response = await request(app).post("/api/login").send({
      email: "test@example.com", // Ensure this matches your users.js
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Missing email or password");
  });
});
