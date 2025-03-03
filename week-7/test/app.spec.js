const request = require("supertest");
const app = require("../src/app");

describe("Chapter 4: API Tests", () => {
  let bookId;

  beforeAll(async () => {
    const response = await request(app)
      .post("/api/books")
      .send({ title: "Initial Book", author: "Test Author" });
    bookId = response.body.id;
  });

  it("Should return a 201-status code when adding a new book", async () => {
    const newBook = { title: "Test Book", author: "John Doe" };
    const response = await request(app).post("/api/books").send(newBook);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Test Book");
    expect(response.body.author).toBe("John Doe");
  });

  it("Should return a 400-status code when adding a new book with missing title", async () => {
    const invalidBook = { author: "Jane Doe" };
    const response = await request(app).post("/api/books").send(invalidBook);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Book title and author are required");
  });

  it("Should return a 204-status code when deleting a book", async () => {
    const response = await request(app).delete(`/api/books/${bookId}`);
    expect(response.status).toBe(204);
  });
});

describe("Chapter 5: API Tests", () => {
  let bookId;

  beforeEach(async () => {
    const response = await request(app)
      .post("/api/books")
      .send({ title: "Test Book", author: "Test Author" });
    bookId = response.body.id;
  });

  test("Should update a book and return a 200 status code", async () => {
    const response = await request(app)
      .put(`/api/books/${bookId}`)
      .send({ title: "Updated Book Title", author: "Updated Author" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "Updated Book Title");
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
      .put(`/api/books/${bookId}`)
      .send({ author: "Author Name" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Book title is required");
  });
});

describe("Chapter 6: API Tests", () => {
  it("should log a user in and return a 200-status with ‘Authentication successful’ message", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: "harry@hogwarts.edu", password: "potter" });
    expect(response.status).toEqual(200);
    expect(response.text).toEqual("Authentication successful");
  });

  it("should return a 401-status code with ‘Unauthorized’ message when logging in with incorrect credentials", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: "harry@hogwarts.edu", password: "wrongpassword" });
    expect(response.status).toEqual(401);
    expect(response.text).toEqual("Unauthorized");
  });

  it("should return a 400-status code with ‘Bad Request’ when missing email or password", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: "harry@hogwarts.edu" });
    expect(response.status).toEqual(400);
    expect(response.text).toEqual("Bad Request");
  });
});
