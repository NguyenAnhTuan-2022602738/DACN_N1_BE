const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// reuse cloudinary configured in authController; ensure env vars are set

exports.uploadImage = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (!req.file || !req.file.buffer) return res.status(400).json({ message: 'No file uploaded' });
    const folder = 'ABC_SHOP';
    const streamUpload = (buffer) => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
        if (result) resolve(result);
        else reject(error);
      });
      streamifier.createReadStream(buffer).pipe(stream);
    });
    const result = await streamUpload(req.file.buffer);
    res.json({ url: result.secure_url, raw: result });
  } catch (e) {
    console.error('Upload image error:', e);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};
