// const express = require('express');
// const router = express.Router();
// const cartController = require('../controllers/cartController');
// const auth = require('../middleware/auth');
// const optionalAuth = require('../middleware/optionalAuth');

// // GET /api/cart - return cart for current user or session
// router.get('/', optionalAuth, cartController.getCart);

// // POST /api/cart/add - add an item (auth optional)
// router.post('/add', optionalAuth, cartController.addItem);

// // POST /api/cart/remove - remove an item (auth optional)
// router.post('/remove', optionalAuth, cartController.removeItem);

// // POST /api/cart/update - update quantity (auth optional)
// router.post('/update', optionalAuth, cartController.updateItem);

// // POST /api/cart/clear - clear cart
// router.post('/clear', optionalAuth, cartController.clearCart);

// module.exports = router;
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

// GET /api/cart - return cart for current user or session
router.get('/', optionalAuth, cartController.getCart);

// POST /api/cart/add - add an item (auth optional)
router.post('/add', optionalAuth, cartController.addItem);

// POST /api/cart/remove - remove an item (auth optional)
router.post('/remove', optionalAuth, cartController.removeItem);

// POST /api/cart/update - update quantity (auth optional)
router.post('/update', optionalAuth, cartController.updateItem);

// POST /api/cart/clear - clear cart
router.post('/clear', optionalAuth, cartController.clearCart);

module.exports = router;