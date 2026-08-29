import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { db, transaction } from './db.js';
import './seed.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.get('/api/products', (req, res) => {
  const { collection } = req.query;
  const rows = collection ? db.prepare('SELECT * FROM products WHERE collection = ? ORDER BY featured DESC, id').all(collection) : db.prepare('SELECT * FROM products ORDER BY featured DESC, id').all();
  res.json(rows);
});
app.get('/api/products/:slug', (req, res) => { const product = db.prepare('SELECT * FROM products WHERE slug = ?').get(req.params.slug); if (!product) return res.status(404).json({ error: 'Product not found' }); res.json(product); });
app.get('/api/collections', (_, res) => res.json(db.prepare('SELECT collection, COUNT(*) AS products, MIN(price) AS from_price FROM products GROUP BY collection').all()));
app.post('/api/newsletter', (req, res) => { const parsed = z.object({email:z.string().email()}).safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'A valid email is required.' }); db.prepare('INSERT OR IGNORE INTO subscribers (email) VALUES (?)').run(parsed.data.email.toLowerCase()); res.status(201).json({ message: 'Subscribed successfully.' }); });
app.post('/api/orders', (req, res) => {
  const schema = z.object({ customer:z.object({name:z.string().min(2),email:z.string().email(),address:z.string().min(10)}), items:z.array(z.object({productId:z.number().int().positive(),quantity:z.number().int().min(1).max(20)})).min(1) });
  const parsed = schema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'Invalid order payload.', details: parsed.error.flatten() });
  try { const order = transaction(() => { const { customer, items } = parsed.data; let total = 0; const products = items.map(item => { const p = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId); if (!p || p.inventory < item.quantity) throw new Error(`Not enough stock for product ${item.productId}`); total += p.price * item.quantity; return {...p, quantity:item.quantity}; }); const reference = `VEL-${randomUUID().slice(0,8).toUpperCase()}`; const result = db.prepare('INSERT INTO orders (reference,customer_name,customer_email,address,total) VALUES (?,?,?,?,?)').run(reference,customer.name,customer.email,customer.address,total); const add = db.prepare('INSERT INTO order_items (order_id,product_id,product_name,unit_price,quantity) VALUES (?,?,?,?,?)'); const reduce = db.prepare('UPDATE products SET inventory = inventory - ? WHERE id = ?'); products.forEach(p => { add.run(result.lastInsertRowid,p.id,p.name,p.price,p.quantity); reduce.run(p.quantity,p.id); }); return { reference, total, id:result.lastInsertRowid }; }); res.status(201).json({ message:'Order received.', order }); } catch (error) { res.status(409).json({ error:error.message }); }
});
app.use((_,res) => res.status(404).json({error:'Route not found'}));
app.listen(process.env.PORT || 4000, () => console.log(`Velora API listening on port ${process.env.PORT || 4000}`));
