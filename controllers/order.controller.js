const express = require('express');
const Order = require('../models/Order');

const orderController = {};

orderController.getOrderList = async (req, res) => {
  try {
    const { orderNum, userEmail } = req.query;
    const condition = {};
    if (orderNum) condition.orderNum = { $regex: orderNum, $options: 'i' };
    if (userEmail) condition.orderNum = { $regex: orderNum, $options: 'i' };
    const orders = await Order.find(condition)
      .populate('userID')
      .populate({
        path: 'items',
        populate: {
          path: 'bookID',
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
