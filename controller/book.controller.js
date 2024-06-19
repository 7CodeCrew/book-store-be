const express = require('express');
const Book = require('../models/Book');
const bookController = {};

bookController.getAllBooks = async (req, res) => {
  try {
    // 나중에 검색 기능 대비
    const { name } = req.query;
    const cond = name ? { name: { $regex: name, $options: 'i' } } : {};
    let query = Book.find(cond);
    let response = { status: 'success' };

    const books = await query.exec();
    response.data = books;
    if (!books) {
      return res.status(404).json({ message: 'No books are found!' });
    }
    return res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by getting book', err });
  }
};

module.exports = bookController;
