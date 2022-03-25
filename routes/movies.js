const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');
const {
  validateMovie,
  validateDeleteMovie,
} = require('../middlewares/validation');

router.get('/movies', getMovies);
router.post('/movies', validateMovie, createMovie);
router.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
