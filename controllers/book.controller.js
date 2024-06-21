const mongoose = require('mongoose');

const express = require('express');
const Book = require('../models/Book');
const Category = require('../models/Category');
const bookController = {};

bookController.getAllBooks = async (req, res) => {
  try {
    const { isbn, title, author, publisher, queryType, categoryId } = req.query;
    const condition = { deleted: { $ne: true } };
    if (isbn) condition.isbn = { $regex: isbn, $options: 'i' };
    if (title) condition.title = { $regex: title, $options: 'i' };
    if (author) condition.author = { $regex: author, $options: 'i' };
    if (publisher) condition.publisher = { $regex: publisher, $options: 'i' };
    if (queryType) condition.queryType = { $regex: queryType, $options: 'i' };
    if (categoryId) condition.categoryId = { $regex: categoryId, $options: 'i' };
    const books = await Book.find(condition);
    res.status(200).json({ status: 'success', books });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

bookController.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findByIdAndUpdate(bookId, { deleted: true }, { new: true });
    if (!book) throw new Error('도서 상품을 찾을 수 없습니다.');
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

bookController.addBook = async (req, res) => {
  try {
    const { isbn, title, author, categoryName, publisher, cover, description, priceStandard, priceSales, stockStatus } =
      req.body;
    const book = new Book({
      isbn,
      title,
      author,
      categoryName,
      publisher,
      cover,
      description,
      priceStandard,
      priceSales,
      stockStatus,
    });
    await book.save();
    res.status(200).json({ status: 'success', book });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

bookController.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { isbn, title, author, categoryName, publisher, cover, description, priceStandard, priceSales, stockStatus } =
      req.body;
    const book = await Book.findByIdAndUpdate(
      bookId,
      { isbn, title, author, categoryName, publisher, cover, description, priceStandard, priceSales, stockStatus },
      { new: true },
    );
    if (!book) throw new Error('도서 상품을 찾을 수 없습니다.');
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

bookController.getBooksByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    // 나중에 검색 기능 대비
    const { isbn, title, author, publisher, queryType } = req.query;
    const condition = {};
    if (isbn) condition.isbn = { $regex: isbn, $options: 'i' };
    if (title) condition.title = { $regex: title, $options: 'i' };
    if (author) condition.author = { $regex: author, $options: 'i' };
    if (publisher) condition.publisher = { $regex: publisher, $options: 'i' };
    if (queryType) condition.queryType = { $regex: queryType, $options: 'i' };
    const category = await Category.findOne({ categoryId }).populate({
      path: 'books',
      model: 'Book',
    });

    if (!category) {
      return res.status(404).json({ message: 'No books are found!' });
    }

    // 검색 조건을 추가로 필터링
    let filteredBooks = category.books.filter((book) => {
      let match = true;
      if (isbn) match = match && new RegExp(isbn, 'i').test(book.isbn);
      if (title) match = match && new RegExp(title, 'i').test(book.title);
      if (author) match = match && new RegExp(author, 'i').test(book.author);
      if (publisher) match = match && new RegExp(publisher, 'i').test(book.publisher);
      if (queryType) match = match && new RegExp(queryType, 'i').test(book.queryType);
      return match;
    });

    let response = {
      status: 'success',
      data: filteredBooks,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by getting book', err });
  }
};
bookController.getBookDetailById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('백엔드에서 디테일 아이디: ', id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    const book = await Book.findById(id);
    if (!book) throw new Error('No item found');
    res.status(200).json({ status: 'success', data: book });
  } catch (error) {
    return res.status(400).json({ status: 'fail', error: error.message });
  }
};
module.exports = bookController;
