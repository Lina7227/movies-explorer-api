const router = require('express').Router();
const {
  updateUserInfo,
  getUser,
} = require('../controllers/user');
const {
  validatyUser,
} = require('../middlewares/validation');

router.get('/me', getUser);
router.patch('/me', validatyUser, updateUserInfo);

module.exports = router;
