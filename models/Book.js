const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    isbn: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
    },
    description: {
      type: String,
    },
    pubDate: {
      type: Date,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    stockStatus: {
      type: String,
    },
    categoryId: {
      type: String,
      required: true,
    },
    mileage: {
      type: Number,
    },
    categoryName: {
      type: String,
    },
    publisher: {
      type: String,
    },
    adult: {
      type: Boolean,
      default: false,
    },
    fixedPrice: {
      type: Boolean,
      default: false,
    },
    priceStandard: {
      type: Number,
      required: true,
    },
    priceSales: {
      type: Number,
    },
    customerReviewRank: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

bookSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.updatedAt;
  delete obj.__v;

  return obj;
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
