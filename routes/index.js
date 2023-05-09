const router = require('express').Router();
const auth = require('../midlleware/auth');
const { createUser, login } = require('../controllers/users');
const { ErrorHandler } = require('../errors/error');
const usersRouter = require('./users');
const articlesRouter = require('./articles');
const { signUpValidation, signInValidation } = require('../midlleware/validation');

router.post('/signin', signInValidation, login);
router.post('/signup', signUpValidation, createUser);
// authorization
router.use(auth);
router.use('/users', usersRouter);
router.use('/articles', articlesRouter);
router.use(() => {
  throw new ErrorHandler(404, 'The requested resource was not found.');
});
module.exports = router
