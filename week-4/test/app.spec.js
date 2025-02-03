const request = require("supertest");
const app = require("../src/app");

describe("Chapter 3: API Tests", () => {
  test("Should return an array of books", async () => {
    const response = await request(app).get("/api/books");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Should return a single book", async () => {
    const response = await request(app).get("/api/books/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("author");
  });

  test("Should return a 400 error if the id is not a number", async () => {
    const response = await request(app).get("/api/books/abc");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Input must be a number");
  });

  test("Should return a 404 error if the book is not found", async () => {
    const response = await request(app).get("/api/books/999");  // Pass an id that doesn't exist
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Book not found");
  });
});
