// Script to fix Wishlist collection indexes
const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ABC_SHOP');
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('wishlists');

    // Get current indexes
    const indexes = await collection.indexes();
    console.log('\n📋 Current indexes:');
    console.log(JSON.stringify(indexes, null, 2));

    // Drop old 'user_1' index if exists
    try {
      await collection.dropIndex('user_1');
      console.log('\n✅ Dropped old index: user_1');
    } catch (e) {
      console.log('\n⚠️  Index user_1 not found (this is OK)');
    }

    // Drop all items with user: null (from old schema)
    const deleteResult = await collection.deleteMany({ user: { $exists: true } });
    console.log(`\n🗑️  Deleted ${deleteResult.deletedCount} old documents with 'user' field`);

    // Create new index on user_id and product_id
    await collection.createIndex(
      { user_id: 1, product_id: 1 }, 
      { unique: true, name: 'user_id_1_product_id_1' }
    );
    console.log('\n✅ Created new index: user_id_1_product_id_1');

    // Get updated indexes
    const newIndexes = await collection.indexes();
    console.log('\n📋 Updated indexes:');
    console.log(JSON.stringify(newIndexes, null, 2));

    console.log('\n🎉 All done! You can now restart your backend server.');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

fixIndexes();
