const Wishlist = require('../models/Wishlist');

// get wishlist for current user
exports.getWishlist = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    
    const items = await Wishlist.find({ user_id: req.user._id });
    res.json({ items });
  } catch (error) {
    console.error('[getWishlist] Error:', error);
    res.status(500).json({ message: 'Failed to get wishlist', error: error.message });
  }
};

// add item to wishlist (idempotent)
exports.addItem = async (req, res) => {
  try {
    console.log('[DEBUG addItem] req.user:', req.user?._id);
    console.log('[DEBUG addItem] Authorization header:', req.headers.authorization ? 'EXISTS' : 'MISSING');
    
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    
    const { productId, product_id, snapshot } = req.body;
    
    // Accept both productId and product_id
    const finalProductId = productId || product_id;
    
    console.log('[DEBUG addItem] Received:', { productId, product_id, finalProductId });
    
    if (!finalProductId) {
      return res.status(400).json({ 
        message: 'Missing product_id',
        received: { productId, product_id }
      });
    }
    
    // Check if already exists
    const existing = await Wishlist.findOne({ 
      user_id: req.user._id,
      product_id: finalProductId 
    });
    
    if (existing) {
      console.log('[DEBUG addItem] Already exists:', existing._id);
      return res.json({ message: 'Already in wishlist', item: existing });
    }
    
    // Create new wishlist item with snapshot
    const item = await Wishlist.create({ 
      user_id: req.user._id,
      product_id: finalProductId,
      snapshot: snapshot || {}
    });
    
    console.log('[DEBUG addItem] Created:', item._id, 'with snapshot:', !!snapshot);
    res.status(201).json({ message: 'Added to wishlist', item });
  } catch (error) {
    console.error('[addItem] Error:', error);
    res.status(500).json({ message: 'Failed to add to wishlist', error: error.message });
  }
};

// remove item
exports.removeItem = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    
    const { productId, product_id } = req.body;
    
    // Accept both productId and product_id
    const finalProductId = productId || product_id;
    
    if (!finalProductId) {
      return res.status(400).json({ 
        message: 'Missing product_id',
        received: { productId, product_id }
      });
    }
    
    const result = await Wishlist.findOneAndDelete({ 
      user_id: req.user._id,
      product_id: finalProductId 
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }
    
    res.json({ message: 'Removed from wishlist', item: result });
  } catch (error) {
    console.error('[removeItem] Error:', error);
    res.status(500).json({ message: 'Failed to remove from wishlist', error: error.message });
  }
};
