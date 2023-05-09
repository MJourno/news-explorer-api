require('dotenv').config();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes');
const { customErrorHandler } = require('./errors/error');
const { requestLogger, errorLogger } = require('./midlleware/logger');


console.log(process.env.NODE_ENV); // production

const app = express();
const { PORT = 3000 } = process.env;

const allowedOrigins = [
  'https://articlear.crabdance.com',
  'https://www.articlear.crabdance.com',
  'https://api.articlear.crabdance.com',
  'http://localhost:3000',
];

mongoose.connect('mongodb://localhost:27017/final-project-db')
  .then(() => {
    console.log('connected to mongoose');
  }).catch((error) => {
    console.log('cant connect', error);
  });

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.options(allowedOrigins, cors());
app.use(requestLogger);
app.use(router);
app.use(errorLogger); // enabling the error logger
app.use(errors());// celebrate error handler

app.use((err, req, res, next) => {
  console.log(err);
  // this is the error handler
  customErrorHandler(err, res);
  console.log(customErrorHandler, 'testErr');
  return next();
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
})
