const bodyParser = require('body-parser');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const { createUser, login } = require('./controllers/users');
const auth = require('./midlleware/auth');
const { ErrorHandler, customErrorHandler } = require('./errors/error');
const { requestLogger, errorLogger } = require('./midlleware/logger');

require('dotenv').config();

console.log(process.env.NODE_ENV); // production

const app = express();
const { PORT = 3000 } = process.env;

const allowedOrigins = [
  // 'https://project15.strangled.net',
  // 'https://www.project15.strangled.net',
  // 'https://api.project15.strangled.net',
  'http://localhost:3000',
];

mongoose.connect('mongodb://localhost:27017/final-project-db')
  .then(() => {
    console.log('connected to mongoose');
  }).catch(error => {
    console.log('cant connect', error);
  });

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.options(allowedOrigins, cors());
app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

// authorization
app.use(auth);

app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

app.use(() => {
  throw new ErrorHandler(404, 'The requested resource was not found.');
});
app.use(errorLogger); // enabling the error logger
app.use(errors());// celebrate error handler

app.use((err, req, res, next) => {
  console.log(err);
  // this is the error handler
  customErrorHandler(err, res);
  console.log(customErrorHandler, 'testErr');
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});