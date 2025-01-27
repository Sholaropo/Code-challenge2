import { Request, Response } from "express";
import { books } from "../data/books"; // Mock book data source

export const returnBook = (req: Request, res: Response) => {
  const { id } = req.params;

  // Find the book by ID
  const book = books.find((b) => b.id === parseInt(id, 10));

  // Check if the book exists
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the book is currently borrowed
  if (!book.borrowerId) {
    return res.status(400).json({ message: "Book is not currently borrowed" });
  }

  // Handle late return logic
  const today = new Date();
  if (book.dueDate && today > new Date(book.dueDate)) {
    const daysLate = Math.ceil(
      (today.getTime() - new Date(book.dueDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    console.warn(`Book returned ${daysLate} days late.`);
    // Add logic for notifying borrower or applying fees (if required)
  }

  // Reset borrower details and make the book available
  book.borrowerId = null;
  book.dueDate = null;

  // Respond with success
  res.status(200).json({ message: "Book successfully returned", book });
};
