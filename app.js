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
const { limiter } = require('./utils/limiter');

console.log(process.env.NODE_ENV); // production

const app = express();
const { PORT = 3000 } = process.env;

const allowedOrigins = [
  'https://news4u.strangled.net',
  'https://www.news4u.strangled.net',
  'https://api.news4u.strangled.net',
  'http://localhost:3000',
];
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_DB)
  .then(() => {
    console.log('connected to mongoose');
  }).catch((error) => {
    console.log('cant connect', error);
  });
app.options('*', cors()); // Handle preflight requests for all routes


app.use(helmet());
app.use(limiter);
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
});
