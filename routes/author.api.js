const express = require('express');
const router = express.Router();
const authorController = require('../controllers/author.controller');

// 특정 책의 저자의 다른 책 조회
router.get('/:bookId', authorController.getOtherBooksByAuthor);

module.exports = router;
