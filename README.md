# Crypto Dashboard

A full-stack cryptocurrency dashboard built with React, TypeScript, Vite, Express, Prisma, and PostgreSQL. Track top coins, view price trends, and chat with an AI assistant for market insights.

---

## Features

- **Frontend:** Vite + React + TypeScript + TailwindCSS
- **Backend:** Express API with scheduled sync from CoinGecko
- **Database:** PostgreSQL (managed via Prisma ORM)
- **Live Chat:** Ask questions about crypto prices and trends

---

## Project Structure

```
crypto-dashboard/
├── api/        # Express backend, Prisma, sync jobs
├── web/        # React frontend (Vite)
├── vercel.json # Vercel deployment config
```

---

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/crypto-dashboard.git
cd crypto-dashboard
```

---

### 2. Backend Setup (`api/`)

#### a. Install dependencies

```sh
cd api
npm install
```

#### b. Configure environment

Edit [`api/.env`](api/.env) with your database and API keys:

```env
PORT=3000
DATABASE_URL="your_postgres_url"
COINGECKO_BASE="https://api.coingecko.com/api/v3"
VS_CURRENCY="usd"
```

#### c. Run Prisma migrations

```sh
npx prisma migrate dev --name init
npx prisma generate
```

#### d. Start the backend server

```sh
npm run dev
```

API will run at `http://localhost:3000`.

---

### 3. Frontend Setup (`web/`)

#### a. Install dependencies

```sh
cd ../web
npm install
```

#### b. Configure environment

Edit [`web/.env`](web/.env):

```env
VITE_API_BASE=http://localhost:3000
```

#### c. Start the frontend

```sh
npm run dev
```

App will run at `http://localhost:5173` (default Vite port).

---

### 4. Development Scripts

| Location | Command         | Description                |
|----------|----------------|----------------------------|
| `api/`   | `npm run dev`  | Start backend (Express)    |
| `web/`   | `npm run dev`  | Start frontend (Vite)      |
| `web/`   | `npm run build`| Build frontend for prod    |

---

### 5. Deployment

- **Vercel:** Project is configured for Vercel deployment via [`vercel.json`](vercel.json).
- **Static Frontend:** Built files are served from `web/dist`.
- **API:** Deploy `api/` as a Vercel serverless function or standalone Node server.

---

## Additional Notes

- **Prisma Schema:** See [`api/prisma/schema.prisma`](api/prisma/schema.prisma) for DB models.
- **API Endpoints:** See [`api/routes/coins.js`](api/routes/coins.js) and [`api/routes/qa.js`](api/routes/qa.js).
- **Frontend Components:** See [`web/src/components`](web/src/components).


---

## Credits

Built by [Atharva khode](https://github.com/atharvakhode).
