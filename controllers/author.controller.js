// const Author = require('../models/Author');
// const Book = require('../models/Book');
//
// const authorController = {};
//
// authorController.getOtherBooksByAuthor = async (req, res) => {
//   try {
//     const { bookId } = req.params;
//     const book = await Book.findById(bookId).populate('authors');
//
//     if (!book) {
//       return res.status(400).json({ message: 'No book found with the given ID' });
//     }
//     console.log(book);
//
//     const authorNames = book.author.split(', ');
//     console.log(authorNames);
//     const authors = await Author.find({ authorName: { $in: [req.params.authorName] } });
//
//     const books = await Book.find({ authors: { $in: authorNames[0] } });
//     console.log(books);
//     //
//     // if (!books.length) {
//     //   return res.status(400).json({ message: 'No books found for these authors' });
//     // }
//     //
//     // res.status(200).json(books);
//   } catch (error) {
//     res.status(400).json({ status: 'fail', error: error.message });
//   }
// };
//
// module.exports = authorController;
