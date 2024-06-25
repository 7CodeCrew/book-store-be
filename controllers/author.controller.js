const Author = require('../models/Author');
const Book = require('../models/Book');

const authorController = {};

authorController.getOtherBooksByAuthor = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId).populate('authors');

    if (!book) {
      return res.status(400).json({ message: 'No book found with the given ID' });
    }

    const authorIds = book.authors.map((author) => author._id);
    const books = await Book.find({ authors: { $in: authorIds } }).populate('authors');

    if (!books.length) {
      return res.status(400).json({ message: 'No books found for these authors' });
    }

    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

module.exports = authorController;
