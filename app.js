require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const router = require('./routes/index');
const auth = require('./middlewares/auth');
const { errorsHandler } = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const corsOptions = require('./utils/utils');
const rateLimiter = require('./middlewares/rateLimiter');
const { BD_URL } = require('./utils/constant');

const app = express();

const { PORT = 3000 } = process.env;

app.use(corsOptions);
app.use(requestLogger);
app.use(cookieParser());

mongoose.connect(BD_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(rateLimiter);

app.use(helmet());

app.use(express.json());

app.use(require('./routes/auth'));

app.use(auth);
app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);
app.listen(PORT);
