const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('./auth');
const NotFound = require('../errors/NotFound');

router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);

router.use((req, res, next) => {
  next(new NotFound(`По адресу ${req.path} ничего нет`));
});

module.exports = router;
