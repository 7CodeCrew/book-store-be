const express = require('express');
const Order = require('../models/Order');
const bookController = require('../controllers/book.controller');
const { randomOrderNumGen } = require('../utils/randomOrderNumGen');

const orderController = {};

orderController.createOrder = async (req, res) => {
  try {
    const { userId } = req;
    const { totalPrice, shipTo, contact, orderList } = req.body;

    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items: orderList,
      orderNum: randomOrderNumGen(),
    });

    await newOrder.save();

    res.status(200).json({ status: 'success', newOrder, orderNum: newOrder.orderNum });
  } catch (error) {
    return res.status(400).json({ status: 'fail', error: error.message });
  }
};

orderController.getMyOrder = async (req, res) => {
  try {
    const { userId } = req;
    const orders = await Order.find({ userId }).populate({
      path: 'items.bookId',
      model: 'Book',
      select: 'title',
    });
    res.status(200).json({ status: 'success', orders });
  } catch (err) {
    return res.status(400).json({ status: 'fail', error: err.message });
  }
};

orderController.getOrderList = async (req, res) => {
  try {
    const { orderNum, userEmail } = req.query;
    const condition = {};
    if (orderNum) condition.orderNum = { $regex: orderNum, $options: 'i' };
    if (userEmail) condition.orderNum = { $regex: orderNum, $options: 'i' };
    const orders = await Order.find(condition)
      .populate('userId')
      .populate({
        path: 'items',
        populate: {
          path: 'bookId',
          model: 'Book',
          select: 'title',
        },
      });
    res.status(200).json({ status: 'Success', orders });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

orderController.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) throw new Error('주문을 찾을 수 없습니다.');
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

module.exports = orderController;
