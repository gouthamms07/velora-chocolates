import { db, transaction } from './db.js';
const items = [
  ['Nocturne Truffles','nocturne-truffles','Dark chocolate, smoked sea salt and a gleam of caramel.',32,'signature','https://images.unsplash.com/photo-1548907040-4d42c10c4381?auto=format&fit=crop&w=800&q=85',42,1],
  ['Golden Hour Bonbons','golden-hour-bonbons','Velvety milk chocolate with toasted hazelnut praline.',28,'classic','https://images.unsplash.com/photo-1575377427642-087cf684f29d?auto=format&fit=crop&w=800&q=85',31,1],
  ['Raspberry Silk','raspberry-silk','Fruit-forward dark chocolate with a soft berry heart.',30,'seasonal','https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85',26,1],
  ['The Tasting Box','the-tasting-box','A dozen of our most-loved expressions, selected by hand.',48,'signature','https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=85',18,1],
  ['Almond Eclipse','almond-eclipse','Single-origin cacao and slow-roasted almond gianduja.',26,'classic','https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=800&q=85',36,0]
];
const insert = db.prepare('INSERT OR IGNORE INTO products (name,slug,description,price,collection,image_url,inventory,featured) VALUES (?,?,?,?,?,?,?,?)');
transaction(() => items.forEach(row => insert.run(...row)));
console.log('Database seeded.');
