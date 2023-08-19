const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../errors/error');

const { JWT_SECRET } = process.env;
require('dotenv').config();
const { NODE_ENV } = require('../utils/constants');

module.exports = (req, res, next) => {
  console.log(req.headers,'req');
  // getting authorization from the header
  const { authorization } = req.headers;
  console.log('Original Authorization:', authorization);  // check the header exists and starts with 'Bearer '

  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log('Authorization header missing or incorrect format');
    return next(new ErrorHandler(401, 'Authorization Error'));
  }
  // getting the token
  const token = authorization.replace('Bearer ', '').trim();
  console.log('Extracted Token:', token);

  let payload;

  try {
    // verifying the token
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    console.log('Token Payload:', payload);

    if (payload) {
      const expirationDate = new Date(payload.exp * 1000); // Convert UNIX timestamp to milliseconds
      console.log('Token Expiration Date:', expirationDate.toISOString());
      req.user = payload;
    } else {
      return next(new ErrorHandler(401, 'Authorization Error'));
    }
  } catch (err) {
    console.log('Error happened in auth', err);
    // we return an error if something goes wrong
    // return handleAuthError(res);
    return next(new ErrorHandler(401, 'Authorization Error'));
  }
  // assigning the payload to the request object
  // sending the request to the next middleware
  return next();
};
