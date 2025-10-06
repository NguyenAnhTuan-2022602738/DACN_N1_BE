require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDb } = require('./config/db');
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const wishlistRoutes = require('./routes/wishlist');
const uploadsRoutes = require('./routes/uploads');
const cartRoutes = require('./routes/cart');

const PORT = process.env.PORT || 4000;

async function main() {
	await connectDb(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/abc-fashion');

		const cookieParser = require('cookie-parser');

		const app = express();
		app.use(cors({ origin: true, credentials: true }));
		app.use(express.json());
		app.use(cookieParser());

	app.use('/api/auth', authRoutes);
	app.use('/api/admin', adminRoutes);
	app.use('/api/wishlist', wishlistRoutes);
	app.use('/api/products', productsRoutes);
	app.use('/api/cart', cartRoutes);
	app.use('/api/uploads', uploadsRoutes);
	app.use('/api/orders', ordersRoutes);

	app.get('/', (req, res) => res.json({ ok: true, message: 'ABC Fashion API' }));

	app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

main().catch(err => {
	console.error('Failed to start server', err);
	process.exit(1);
});
