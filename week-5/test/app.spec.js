const request = require("supertest");
const app = require("../src/app"); // Import your Express app

describe("Chapter 4: API Tests", () => {
  // Test case 1: Adding a book successfully
  it("Should return a 201-status code when adding a new book", async () => {
    const newBook = { id: 1, title: "Test Book", author: "John Doe" };

    const response = await request(app)
      .post("/api/books")
      .send(newBook);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Book added successfully");
  });

  // Test case 2: Trying to add a book without a title (should fail)
  it("Should return a 400-status code when adding a new book with missing title", async () => {
    const invalidBook = { id: 2, author: "Jane Doe" };

    const response = await request(app)
      .post("/api/books")
      .send(invalidBook);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Book title is required");
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

  test("Should update a book and return a 204 status code", async () => {
    const response = await request(app)
      .put("/api/books/1")
      .send({ title: "Updated Book Title", author: "Updated Author" });

    expect(response.status).toBe(204);
  });

  test("Should return a 400-status code when using a non-numeric id", async () => {
    const response = await request(app)
      .put("/api/books/foo")
      .send({ title: "Some Book", author: "Author Name" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Input must be a number");
  });

  test("Should return a 400-status code when updating a book with a missing title", async () => {
    const response = await request(app)
      .put("/api/books/1")
      .send({ author: "Author Name" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Bad Request: Book title is required");
  });

});
