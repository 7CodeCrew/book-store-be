const mongoose = require('mongoose');

const express = require('express');
const Book = require('../models/Book');
const Category = require('../models/Category');
const bookController = {};

bookController.getAllBooks = async (req, res) => {
  try {
    const { total, isbn, title, author, publisher, queryType, categoryId } = req.query;
    let condition = { deleted: { $ne: true } };

    if (total) condition = { $and: [condition, {$or: [ 
      {isbn: { $regex: total, $options: 'i' } },
      {title: { $regex: total, $options: 'i' } },
      {author: { $regex: total, $options: 'i' } },
      {publisher: { $regex: total, $options: 'i' } },
      {queryType: { $regex: total, $options: 'i' } },
      {categoryId: { $regex: total, $options: 'i' } },
    ]}] };
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
    const category = await Category.findOne({ categoryId }).populate({
      path: 'books',
      model: 'Book',
    });

    if (!category) {
      return res.status(404).json({ message: 'No books are found!' });
    }

    let response = {
      status: 'success',
      data: category.books,
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
bookController.getBooksByGroup = async (req, res) => {
  try {
    const queryType = req.params.queryType;
    const books = await Book.find({ queryType: queryType });

    console.log(queryType, books);
    return res.status(200).json({ status: 'success', books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error by getting book', err });
  }
};

// bookController.getBooksByAuthor = async(req,res) => {

// };
module.exports = bookController;
