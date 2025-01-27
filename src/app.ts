const express = require("express");
const app = express();
app.use(express.json());



const borrowingHistory = [];
const userBorrowedBooks = {}; // Tracks the number of books borrowed by each user

// Borrowing limit and due date policy
const BORROW_LIMIT = 5;
const DUE_DATE_DAYS = 14;

// Helper function to calculate due date
function calculateDueDate() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + DUE_DATE_DAYS);
  return currentDate;
}

// Endpoint to borrow a book
app.post("/api/v1/books/:id/borrow", (req, res) => {
  const bookId = parseInt(req.params.id);
  const { borrowerId } = req.body;

  // Validate request
  if (!borrowerId) {
    return res.status(400).json({ error: "Borrower ID is required" });
  }

  const book = books.find((b) => b.id === bookId);

  // Check if book exists
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  // Check if book is already borrowed
  if (book.borrowerId) {
    return res.status(400).json({ error: "Book is already borrowed" });
  }

  // Check user's borrowing limit
  if (userBorrowedBooks[borrowerId] >= BORROW_LIMIT) {
    return res.status(400).json({ error: "Borrowing limit reached" });
  }

  // Mark book as borrowed
  const dueDate = calculateDueDate();
  book.borrowerId = borrowerId;
  book.dueDate = dueDate;

  userBorrowedBooks[borrowerId] = (userBorrowedBooks[borrowerId] || 0) + 1;

  

  // Respond with success
  res.status(200).json({
    message: "Book borrowed successfully",
    bookId: book.id,
    borrowerId,
    dueDate,
  });
});

// Example server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
