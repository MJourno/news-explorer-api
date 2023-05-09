const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ErrorHandler } = require('../errors/error');
const { NODE_ENV } = require('../utils/constants');

const getUserById = async (req, res, next) => {
  console.log(typeof (req.user._id));
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ErrorHandler(404, 'User ID not found'));
    }
    res.status(200).send(user);
  } catch (err) {
    console.log('Error happened in getUserById', err);
    if (err.name === 'CastError') {
      return next(new ErrorHandler(500, 'An error has occurred on the server.'));
    }
  }
  return {};
};

const createUser = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    if (!email && !password && !name) {
      return next(new ErrorHandler(400, 'email password and name reqwired'));
    }
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return next(new ErrorHandler(409, 'email already exists'));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });
    if (hashedPassword && user) {
      res.status(201).send({ id: user._id, email: user.email });
    }
  } catch (err) {
    console.log('Error happened in createUser', err);
    if (err.name === 'ValidationError') {
      return next(new ErrorHandler(400, `${err.name}: Something went wrong`));
    }
    return next(new ErrorHandler(500, `${err.name}: An error has occurred on the server`));
  }
  return {};
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.log('Error happened in login', err);
      return next(new ErrorHandler(401, 'Something went wrong'));
    });
};

module.exports = {
  getUserById,
  createUser,
  login,
};
