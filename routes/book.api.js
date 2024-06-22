const express = require('express');
const {
  getAllBooks,
  getBooksByCategory,
  deleteBook,
  updateBook,
  addBook,
  getBookDetailById,
  getBooksByGroup,
} = require('../controllers/book.controller');

const router = express.Router();

router.get('/', getAllBooks);
router.delete('/:id', deleteBook);
router.put('/:id', updateBook);
router.post('/', addBook);
router.get('/category/:categoryId', getBooksByCategory);
router.get('/group/:queryType', getBooksByGroup);

router.get('/detail/:id', getBookDetailById);

module.exports = router;
