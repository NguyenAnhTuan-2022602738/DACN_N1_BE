const Category = require('../models/Category');

// GET /api/categories - Lấy tất cả danh mục
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parent_id', 'name slug')
      .sort({ sort_order: 1, created_at: -1 });
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách danh mục',
      error: error.message
    });
  }
};

// GET /api/categories/:id - Lấy danh mục theo ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent_id', 'name slug');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin danh mục',
      error: error.message
    });
  }
};

// POST /api/categories - Tạo danh mục mới
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, parent_id, image_url, is_active, is_featured, sort_order, meta_title, meta_description } = req.body;
    
    // Kiểm tra slug đã tồn tại chưa
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Slug đã tồn tại, vui lòng chọn slug khác'
      });
    }
    
    // Kiểm tra parent_id có hợp lệ không
    if (parent_id) {
      const parentCategory = await Category.findById(parent_id);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: 'Danh mục cha không tồn tại'
        });
      }
    }
    
    const category = new Category({
      name,
      slug,
      description,
      parent_id: parent_id || null,
      image_url,
      is_active,
      is_featured,
      sort_order,
      meta_title,
      meta_description
    });
    
    await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo danh mục',
      error: error.message
    });
  }
};

// PUT /api/categories/:id - Cập nhật danh mục
exports.updateCategory = async (req, res) => {
  try {
    const { name, slug, description, parent_id, image_url, is_active, is_featured, sort_order, meta_title, meta_description } = req.body;
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    // Kiểm tra slug đã tồn tại chưa (trừ chính nó)
    if (slug && slug !== category.slug) {
      const existingCategory = await Category.findOne({ slug });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Slug đã tồn tại, vui lòng chọn slug khác'
        });
      }
    }
    
    // Kiểm tra parent_id có hợp lệ không
    if (parent_id) {
      // Không cho phép chọn chính nó làm parent
      if (parent_id === req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Không thể chọn chính danh mục này làm danh mục cha'
        });
      }
      
      const parentCategory = await Category.findById(parent_id);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: 'Danh mục cha không tồn tại'
        });
      }
    }
    
    // Cập nhật các trường
    if (name !== undefined) category.name = name;
    if (slug !== undefined) category.slug = slug;
    if (description !== undefined) category.description = description;
    if (parent_id !== undefined) category.parent_id = parent_id || null;
    if (image_url !== undefined) category.image_url = image_url;
    if (is_active !== undefined) category.is_active = is_active;
    if (is_featured !== undefined) category.is_featured = is_featured;
    if (sort_order !== undefined) category.sort_order = sort_order;
    if (meta_title !== undefined) category.meta_title = meta_title;
    if (meta_description !== undefined) category.meta_description = meta_description;
    
    await category.save();
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật danh mục',
      error: error.message
    });
  }
};

// DELETE /api/categories/:id - Xóa danh mục
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    // Kiểm tra xem có danh mục con không
    const childCategories = await Category.find({ parent_id: req.params.id });
    if (childCategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa danh mục có danh mục con. Vui lòng xóa danh mục con trước.'
      });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Xóa danh mục thành công'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa danh mục',
      error: error.message
    });
  }
};
