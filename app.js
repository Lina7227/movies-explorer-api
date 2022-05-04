require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const router = require('./routes/index');
const auth = require('./middlewares/auth');
const { errorsHandler } = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const corsOptions = require('./utils/utils');
const rateLimiter = require('./middlewares/rateLimiter');
const { BD_URL } = require('./utils/constant');

const app = express();

const { PORT = 3000 } = process.env;

const corsOptions = {
  origin: [
    'https://diploma-gallery-movies.herokuapp.com',
    'https://movies-explorer-frontend-black.vercel.app',
    'https://movies-explorer-frontend-git-main-lina7227.vercel.app',
    'https://movies-explorer-frontend-lina7227.vercel.app',
    'http://localhost:3001',
    'http://localhost:3000',
    'https://web.postman.co',
  ],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// app.use(corsOptions);
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
