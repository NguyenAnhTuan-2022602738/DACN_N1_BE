// Check Wishlist collection data
const mongoose = require('mongoose');
require('dotenv').config();

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ABC_SHOP');
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('wishlists');

    // Count all documents
    const total = await collection.countDocuments();
    console.log(`\n📊 Total wishlist documents: ${total}`);

    // Find all documents
    const docs = await collection.find({}).limit(10).toArray();
    console.log('\n📋 Sample documents:');
    docs.forEach((doc, i) => {
      console.log(`\n${i + 1}.`, {
        _id: doc._id,
        user: doc.user,
        user_id: doc.user_id,
        product_id: doc.product_id,
        hasSnapshot: !!doc.snapshot
      });
    });

    // Find documents with old 'user' field
    const oldDocs = await collection.find({ user: { $exists: true } }).toArray();
    console.log(`\n⚠️  Documents with old 'user' field: ${oldDocs.length}`);

    if (oldDocs.length > 0) {
      console.log('\n🗑️  Deleting old documents...');
      const deleteResult = await collection.deleteMany({ user: { $exists: true } });
      console.log(`✅ Deleted ${deleteResult.deletedCount} old documents`);
    }

    // Also delete documents with user_id: null
    const nullUserDocs = await collection.find({ user_id: null }).toArray();
    console.log(`\n⚠️  Documents with user_id: null: ${nullUserDocs.length}`);
    
    if (nullUserDocs.length > 0) {
      console.log('🗑️  Deleting null user_id documents...');
      const deleteResult = await collection.deleteMany({ user_id: null });
      console.log(`✅ Deleted ${deleteResult.deletedCount} documents`);
    }

    console.log('\n✅ Cleanup complete!');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkData();
