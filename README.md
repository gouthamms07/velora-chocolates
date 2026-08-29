# Velora Chocolates

A full-stack artisan chocolate shop inspired by the supplied visual reference, implemented with original brand copy and imagery.

## Run locally

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173` · API: `http://localhost:4000/api`

The API initializes and seeds `server/data/velora.db` automatically on first launch.

## Run with Docker

```bash
docker compose up --build
```

Open `http://localhost:5173`. The SQLite data is stored in the named Docker volume `velora_data`.

## API

- `GET /api/products?collection=signature`
- `GET /api/products/:slug`
- `GET /api/collections`
- `POST /api/newsletter` — `{ "email": "you@example.com" }`
- `POST /api/orders` — `{ "customer": { "name", "email", "address" }, "items": [{ "productId", "quantity" }] }`

## Stack

React + Vite frontend, Express API, and SQLite database. Order creation validates stock, writes order records, and decrements inventory transactionally.
