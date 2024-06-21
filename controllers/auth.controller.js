require('dotenv').config;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { GoogleAuth, OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authController = {};

authController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = bcrypt.compareSync(password, user.password);
      if (isMatch) {
        const token = await user.generateToken();
        return res.status(200).json({ status: 'success', user, token });
      }
    }
    throw new Error('Invalid email or password');
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

authController.loginWithGoogle = async(req, res) => {
  try{
      const { token } = req.body;
      if (!token) {
        throw new Error('Token is missing');
      }
      const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await googleClient.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
      });
      const { email, name } = ticket.getPayload();
      let user = await User.findOne({email});

      if (!user){
          const randomPassword = '' + Math.floor(Math.random()*100000000);
          const salt = await bycript.genSalt(10);

          const newPassword = await bycript.hash(randomPassword, salt);
          user = new User({
              userName : name, 
              email,
              password: newPassword,
          });
          await user.save();
      }
      const sessionToken = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '1h' });
      return res.status(200).json({status: 'success', user, token: sessionToken});
  }catch(error){
      console.log('Error during Google login:', error); 
      res.status(400).json({status:"fail", error:error.message});
  }
};

authController.authenticate = async (req, res, next) => {
  try {
      const tokenString = req.headers.authorization;
      if (!tokenString) {
          throw new Error("Authentication token does not exist!");
      }
      const token = tokenString.replace("Bearer ", "");
      jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
          if (error) {
              console.log("invalid token", error);
              return res.status(401).json({ status: "fail", message: "Invalid token" });
          }
          req.userId = payload._id;
          next(); 
      });
  } catch (error) {
      res.status(400).json({ status: "fail", message: error.message });
  }
};

authController.checkAdminPermission = async(req, res, next) => {
  try{
      const { userId } = req
      const user = await User.findById(userId);
      if(user.role !== "admin") throw new Error("no permission")
      next()
  }catch(error){
      res.status(400).json({status:"fail", error:error.message})
  }
};

module.exports = authController;
