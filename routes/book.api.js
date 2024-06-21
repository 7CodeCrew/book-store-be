const express = require('express');
const { getAllBooks, getBooksByCategory, deleteBook, updateBook, addBook } = require('../controllers/book.controller');

const router = express.Router();

router.get('/', getAllBooks);
router.delete('/:id', deleteBook);
router.put('/:id', updateBook);
router.post('/', addBook);
router.get('/:categoryId', getBooksByCategory);

module.exports = router;
