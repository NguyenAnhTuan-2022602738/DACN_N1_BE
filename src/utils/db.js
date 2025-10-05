const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { join } = require('path');
const { nanoid } = require('nanoid');

let db;

async function initDb() {
  const file = join(__dirname, '../../data/db.json');
  const adapter = new JSONFile(file);
  db = new Low(adapter);
  await db.read();
  db.data ||= { users: [], products: [], orders: [] };

  // Seed a few products if empty
  if (!db.data.products || db.data.products.length === 0) {
    db.data.products = [
      {
        id: nanoid(),
        name: 'Áo Thun Cotton Premium',
        price: 290000,
        images: [],
        description: 'Áo thun cotton mềm mại',
        stock: 120
      },
      {
        id: nanoid(),
        name: 'Váy Maxi Hoa Nhí Vintage',
        price: 890000,
        images: [],
        description: 'Váy midi nữ tính',
        stock: 50
      }
    ];
  }

  await db.write();
}

function getDb() {
  if (!db) throw new Error('DB not initialized');
  return db;
}

module.exports = { initDb, getDb };
