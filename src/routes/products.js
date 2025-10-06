const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

router.get('/', productController.list);
router.get('/:id', productController.get);
router.patch('/:id/publish', auth, requireRole('admin','manager','vendor'), productController.publish);
// protected: only staff can create/update/delete
router.post('/', auth, requireRole('admin','manager','vendor'), productController.create);
router.put('/:id', auth, requireRole('admin','manager','vendor'), productController.update);
router.delete('/:id', auth, requireRole('admin','manager','vendor'), productController.remove);

module.exports = router;
