const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes (Staff/Manager/Admin can manage categories)
router.post('/', auth, requireRole('staff','manager','admin'), categoryController.createCategory);
router.put('/:id', auth, requireRole('staff','manager','admin'), categoryController.updateCategory);
router.delete('/:id', auth, requireRole('manager','admin'), categoryController.deleteCategory);

module.exports = router;

module.exports = router;
