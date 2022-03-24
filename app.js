require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const { errors } = require('celebrate');
// const router = require('./routes/index');
// const auth = require('./middlewares/auth');
// const { errorsHandler } = require('./middlewares/errorsHandler');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.json());

// app.use(require('./routes/auth'));

// app.use(auth);
// app.use(router);
// app.use(errors());
// app.use(errorsHandler);
app.listen(PORT, () => {

});
