import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const filename = resolve(process.env.DATABASE_FILE || './data/velora.db');
mkdirSync(dirname(filename), { recursive: true });
export const db = new DatabaseSync(filename);
db.exec('PRAGMA journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT NOT NULL,
    price REAL NOT NULL CHECK(price >= 0), collection TEXT NOT NULL, image_url TEXT NOT NULL,
    inventory INTEGER NOT NULL DEFAULT 0 CHECK(inventory >= 0), featured INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY, reference TEXT UNIQUE NOT NULL, customer_name TEXT NOT NULL, customer_email TEXT NOT NULL,
    address TEXT NOT NULL, total REAL NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL REFERENCES orders(id), product_id INTEGER NOT NULL REFERENCES products(id),
    product_name TEXT NOT NULL, unit_price REAL NOT NULL, quantity INTEGER NOT NULL CHECK(quantity > 0)
  );
`);

export function transaction(work) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = work();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
