const Book = require('../models/Book');
const Cart = require('../models/Cart');
const User = require('../models/User');
const cartController = {};

cartController.addItemToCart = async (req, res) => {
  try {
    // 1. 정보 가져오기
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

// cartController.getCartList = async (req, res) => {
//   try {
//     const { userId } = req;
//     const cartList = await Cart.findOne({ userId }).populate({
//       path: 'items',
//       populate: {
//         path: 'bookId',
//         model: Book,
//       },
//     });
//     res.status(200).json({ status: 'Success', data: cartList.items });
//   } catch (error) {
//     return res.status(400).json({ status: 'Fail..', message: error.message });
//   }
// };

cartController.getCartList = async (req, res) => {
  try {
    const { userId } = req;

    // 사용자 정보 가져오기
    const user = await User.findById(userId);

    // 장바구니 항목 가져오기
    const cartList = await Cart.findOne({ userId }).populate({
      path: 'items',
      populate: {
        path: 'bookId',
        model: Book,
      },
    });

    if (!user || !cartList) {
      return res.status(404).json({ status: 'Fail', message: 'User or cart not found' });
    }

    // 사용자 정보와 장바구니 항목을 배열 형태로 응답
    res.status(200).json({ status: 'Success', data: { user, items: cartList.items } });
  } catch (error) {
    return res.status(400).json({ status: 'Fail..', message: error.message });
  }
};

module.exports = cartController;
