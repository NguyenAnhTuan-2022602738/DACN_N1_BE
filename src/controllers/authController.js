const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// helper to send email via SMTP. This function requires SMTP env vars to be configured.
// It sends a short plain+HTML email containing the code and a clear instruction NOT to share it.
async function sendResetEmail(to, code) {
  // require SMTP configuration to actually send email
  if (!process.env.SMTP_HOST) {
    throw new Error('SMTP not configured');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });

  const subject = 'ABC Fashion — Mã đặt lại mật khẩu';
  const plain = `Mã đặt lại mật khẩu của bạn là: ${code}\nMã sẽ hết hạn trong 1 phút. Không chia sẻ mã này với bất kỳ ai.`;
  const html = `<div style="font-family: Arial, sans-serif; line-height:1.4;">
    <h3>ABC Fashion — Mã đặt lại mật khẩu</h3>
    <p>Xin chào,</p>
    <p>Mã đặt lại mật khẩu của bạn là:</p>
    <div style="font-size:22px; font-weight:700; background:#f6f6f6; padding:10px; display:inline-block;">${code}</div>
    <p>Mã sẽ hết hạn trong <strong>1 phút</strong>. Không chia sẻ mã này với bất kỳ ai. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    <p>Trân trọng,<br/>ABC Fashion</p>
  </div>`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@abcfashion.local',
    to,
    subject,
    text: plain,
    html
  });
}

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// upload avatar via buffer stream; ensure folder ABC_SHOP is used
exports.uploadAvatar = async (req, res) => {
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
    // save url to user
    const user = await User.findById(req.user._id);
    user.avatar = result.secure_url;
    await user.save();
    const safe = user.toObject(); delete safe.password;
    res.json({ user: safe, url: result.secure_url });
  } catch (e) {
    console.error('Upload avatar error:', e);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "User exists" });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    // set httpOnly cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user: { id: user._id, email: user.email, name: user.name }, token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ user: { id: user._id, email: user.email, name: user.name }, token });
};

  exports.logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ ok: true });
  };
exports.me = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  res.json({ user: req.user });
};

exports.updateMe = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  const allowed = ['name', 'email', 'phone', 'dateOfBirth', 'gender', 'avatar', 'settings', 'addresses'];
  const updates = {};
  for (const key of allowed) {
    if (typeof req.body[key] !== 'undefined') updates[key] = req.body[key];
  }
  // Sanitize addresses payload: remove frontend-only 'id' and any invalid _id values
  if (updates.addresses) {
    if (!Array.isArray(updates.addresses)) return res.status(400).json({ message: 'addresses must be an array' });
    updates.addresses = updates.addresses.map(a => {
      const copy = { ...a };
      // frontend may send `id` numeric timestamps — remove it
      if (typeof copy.id !== 'undefined') delete copy.id;
      // preserve valid _id, but drop invalid ones
      if (typeof copy._id !== 'undefined' && !mongoose.isValidObjectId(copy._id)) delete copy._id;
      // ensure default is boolean
      if (typeof copy.default !== 'undefined') copy.default = !!copy.default;
      if (typeof copy.isDefault !== 'undefined') copy.default = !!copy.isDefault;
      return copy;
    });
  }
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  // If the request provides addresses, treat this as an addresses-only update
  if (typeof updates.addresses !== 'undefined') {
    // updates.addresses already sanitized above
    try { console.log('DEBUG updateMe addresses payload:', JSON.stringify(updates.addresses, null, 2)); } catch (err) { /* ignore */ }
    const updated = await User.findByIdAndUpdate(req.user._id, { $set: { addresses: updates.addresses } }, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    const safe = updated.toObject(); delete safe.password;
    return res.json({ user: safe });
  }

  // If email is being changed, ensure uniqueness
  if (updates.email && updates.email !== user.email) {
    const exists = await User.findOne({ email: updates.email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    user.email = updates.email;
  }

  // Merge other fields (create if missing)
  for (const [k, v] of Object.entries(updates)) {
    if (k === 'email') continue;
    // merge settings object if provided
    if (k === 'settings' && typeof v === 'object') {
      user.settings = { ...(user.settings || {}), ...v };
    } else {
      user[k] = v;
    }
  }

  await user.save();
  // return full user without password
  const safe = user.toObject();
  delete safe.password;
  res.json({ user: safe });
};

// change password endpoint
exports.changePassword = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Missing fields' });
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) return res.status(401).json({ message: 'Current password incorrect' });
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();
  res.json({ message: 'Password updated' });
};

// request a reset code
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Missing email' });
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If that email exists, a reset code was sent.' });
  // generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = crypto.createHash('sha256').update(code).digest('hex');
  user.resetPasswordCodeHash = hash;
  user.resetPasswordExpires = Date.now() + 1 * 60 * 1000; // 1 minute expiry
  await user.save();
  // send email (or log)
  try {
    await sendResetEmail(user.email, code);
  } catch (e) {
    console.error('Failed to send reset email:', e);
    // do not expose the code in any response or logs
    return res.status(500).json({ message: 'Không thể gửi email. Vui lòng kiểm tra cấu hình SMTP.' });
  }
  // always respond with a generic message and never include or log the code
  res.json({ message: 'Nếu email tồn tại, mã đã được gửi tới hộp thư.' });
};

// reset password using code
exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) return res.status(400).json({ message: 'Missing fields' });
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid code or email' });
  if (!user.resetPasswordCodeHash || !user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
    return res.status(400).json({ message: 'Reset code expired or invalid' });
  }
  const hash = crypto.createHash('sha256').update(code).digest('hex');
  if (hash !== user.resetPasswordCodeHash) return res.status(400).json({ message: 'Invalid reset code' });
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.resetPasswordCodeHash = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: 'Password reset' });
};
