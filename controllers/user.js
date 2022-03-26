const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const ConflictingPrompt = require('../errors/ConflictingPrompt');
const Unauthorized = require('../errors/Unauthorized ');
const {
  notFoundUserId,
  incorrectData,
  userAlreadyBe,
  userNotAuthorized,
} = require('../errors/errorMessages');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((({ _id }) => User.findById(_id)))
    .then((user) => {
      res.send(user.toJSON());
    })
    .catch((err) => {
      if (err.message === 'ValidationError') {
        next(new BadRequest(incorrectData));
      } else if (err.code === 11000) {
        next(new ConflictingPrompt(userAlreadyBe));
      } else {
        next(err);
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const id = req.user._id;
  const { name, email } = req.body;

  User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true })
    .orFail(() => new NotFound(notFoundUserId))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest(userAlreadyBe));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', `Bearer ${token}`, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        domain: '.gallery-movies.nomoredomains.xyz',
        sameSite: 'none',
        secure: true,
      })
        .status(200).send({ id: user._id });
    })
    .catch(() => {
      next(new Unauthorized(userNotAuthorized));
    });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.message === 'NotValidId') {
        next(new NotFound(notFoundUserId));
      } else if (err.user === 'CastError') {
        next(new BadRequest(incorrectData));
      } else {
        next(err);
      }
    });
};

const logout = (req, res, next) => {
  try {
    res.clearCookie('jwt');
    res.status(200).send({ message: 'Выход из аккаутна успешно совершен' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  updateUserInfo,
  login,
  getUser,
  logout,
};
