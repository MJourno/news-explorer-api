const express = require('express');
const router = express.Router();
const auth = require('../midlleware/auth');
const {
  getUserById,
} = require('../controllers/users');

router.get('/users/me',auth, getUserById);

module.exports = router;
