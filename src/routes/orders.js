const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, orderController.create);
router.get('/', authMiddleware, orderController.list);
router.get('/:id', authMiddleware, orderController.get);

module.exports = router;
