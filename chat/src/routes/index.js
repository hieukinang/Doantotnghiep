const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/conversations', require('./conversations'));
router.use('/messages', require('./messages'));

module.exports = router;
