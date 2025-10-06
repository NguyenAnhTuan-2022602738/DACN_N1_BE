// List all indexes on wishlists collection
const mongoose = require('mongoose');
require('dotenv').config();

async function listIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ABC_SHOP');
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('wishlists');

    // Get all indexes
    const indexes = await collection.indexes();
    console.log('\n📋 All indexes on wishlists collection:');
    console.log(JSON.stringify(indexes, null, 2));

    // Try to drop user_1 explicitly
    console.log('\n🗑️  Attempting to drop all indexes except _id...');
    
    for (const index of indexes) {
      if (index.name !== '_id_') {
        try {
          await collection.dropIndex(index.name);
          console.log(`✅ Dropped index: ${index.name}`);
        } catch (e) {
          console.log(`⚠️  Could not drop ${index.name}: ${e.message}`);
        }
      }
    }

    // Recreate the correct index
    console.log('\n📝 Creating correct index...');
    await collection.createIndex(
      { user_id: 1, product_id: 1 }, 
      { unique: true }
    );
    console.log('✅ Created index: { user_id: 1, product_id: 1 }');

    // Show final indexes
    const finalIndexes = await collection.indexes();
    console.log('\n📋 Final indexes:');
    console.log(JSON.stringify(finalIndexes, null, 2));

    console.log('\n🎉 Done! Restart your backend server now.');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

listIndexes();
