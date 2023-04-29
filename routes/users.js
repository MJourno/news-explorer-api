const express = require('express');

const router = express.Router();
const {
  getUserById,
} = require('../controllers/users');

router.get('/me', getUserById);


module.exports = router;