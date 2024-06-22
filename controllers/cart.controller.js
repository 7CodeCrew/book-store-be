const Cart = require('../models/Cart');
const cartController = {};

cartController.addItemToCart = async (req, res) => {
  try {
    // 1. 정보 가져오기
    // 1-1. User Id
    // 1-2. 상품 Id, qty
    const { userId } = req;
    const { bookId, qty } = req.body;
    // 1.5 유저를 가지고 카트 찾기 카트가 없으면 새로 만들어 주기
    let cart = await Cart.findOne({ userId });
    // 카트가 없으면 새로 만들어 주기
    if (!cart) {
      cart = new Cart({ userId });
      await cart.save();
    }
    // 중복 항목 있으면 에러
    const existItem = cart.items.find((item) => item.bookId.equals(bookId));

    if (existItem) {
      throw new Error('Item alreay exist.');
    }

    // 2. 새로운 아이템을 카트에 추가
    cart.items = [...cart.items, { bookId, qty }];
    await cart.save();
    res.status(200).json({ status: 'Success', data: cart, cartItemQty: cart.items.length });
  } catch (error) {
    return res.status(400).json({ status: 'Fail..', message: error.message });
  }
};

module.exports = cartController;
