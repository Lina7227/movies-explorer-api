const jwtToken = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized ');
const { KEY_JWT } = require('../utils/constant');

/* eslint-disable consistent-return */
module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt || !jwt.startsWith('Bearer ')) {
    throw new Unauthorized('Необходимо авторизоваться');
  }
  const token = jwt.replace('Bearer ', '');

  let payload;
  try {
    payload = jwtToken.verify(token, KEY_JWT);
    req.user = payload;
    next();
  } catch (err) {
    next(new Unauthorized('Необходимо авторизоваться'));
  }
};
