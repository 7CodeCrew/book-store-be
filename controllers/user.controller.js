const User = require('../models/User');
const bcrypt = require('bcryptjs');

const userController = {};

userController.createUser = async (req, res) => {
  try {
    let { userName, email, password, role, level, address, phone } = req.body;
    let user = await User.findOne({ email });
    console.log('유져!!', user);
    if (user) {
      return res.status(400).json({ status: 'fail', error: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user = new User({
      userName,
      email,
      password,
      role: role || 'customer',
      level: level || 'bronze',
      address,
      phone,
    });
    await user.save();
    return res.status(200).json({ status: 'success', user });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

userController.getUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (user) {
      return res.status(200).json({ status: 'success', user });
    } else {
      return res.status(400).json({ status: 'error', error: 'Invalid token 실패!!' });
    }
  } catch (err) {
    res.status(400).json({ status: 'error', error: err.message });
  }
};

module.exports = userController;
