const router = require('express').Router();
const { login, createUser, logout } = require('../controllers/user');
const {
  validatySigUp,
  validatySigIn,
} = require('../middlewares/validation');

router.post('/signin', validatySigIn, login);
router.post('/signup', validatySigUp, createUser);
router.get('/logout', logout);

module.exports = router;
