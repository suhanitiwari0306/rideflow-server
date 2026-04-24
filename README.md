# RideFlow — Phase 2 MVP

**Full-stack rideshare management app · Riders vertical slice**  
MIS 372T · Suhani Tiwari

---

## What's in this MVP

This MVP implements **full CRUD for the Riders table**, covering every layer of the stack:

| Layer | Tech | Details |
|-------|------|---------|
| Frontend framework | React 18 + Vite | Component-based, no TypeScript required |
| Styling | External CSS (index.css) | No inline styles — classes & ids only |
| HTTP client | Axios | Centralized in `services/api.js` |
| Backend | Node.js + Express | REST API, JSON responses |
| ORM | Sequelize | Auto-syncs table on startup |
| Database | PostgreSQL | Hosted on Neon or Render |

**API routes implemented:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/riders` | Get all riders (supports `?search=`) |
| GET | `/api/riders/:id` | Get one rider |
| POST | `/api/riders` | Create rider |
| PUT | `/api/riders/:id` | Update rider |
| DELETE | `/api/riders/:id` | Delete rider |

---

## Project Structure

```
rideflow/
├── server/
│   ├── config/
│   │   └── database.js        # Sequelize connection
│   ├── controllers/
│   │   └── ridersController.js # CRUD logic
│   ├── models/
│   │   └── Rider.js           # Sequelize model
│   ├── routes/
│   │   └── riders.js          # Express router
│   ├── .env.example           # Copy → .env
│   ├── index.js               # Server entry point
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── RidersTable.jsx
    │   │   ├── RiderForm.jsx   # Create & Edit modal
    │   │   ├── DeleteModal.jsx
    │   │   └── Toast.jsx
    │   ├── pages/
    │   │   └── RidersPage.jsx  # Orchestrates all CRUD state
    │   ├── services/
    │   │   └── api.js          # Axios instance + ridersApi
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css           # All styles (no inline CSS)
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Setup Instructions

### 1. Database — Neon (recommended free tier)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project called `rideflow`
3. Copy your connection string — it looks like:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/rideflow?sslmode=require
   ```
4. Note the individual parts for your `.env` file

> **Alternatively:** Use [Render PostgreSQL](https://render.com) — create a free PostgreSQL instance and grab the connection details from the dashboard.

---

### 2. Backend Setup

```bash
cd server
npm install

# Copy the env template and fill in your database credentials
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=ep-your-neon-host.us-east-2.aws.neon.tech
DB_PORT=5432
DB_NAME=rideflow
DB_USER=your_neon_username
DB_PASSWORD=your_neon_password
DB_SSL=true
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
```

Start the server:
```bash
node index.js
```

You should see:
```
✅ Database connected
✅ Models synced
🚀 RideFlow server running on http://localhost:3001
```

> Sequelize's `sync({ alter: true })` will automatically **create the `riders` table** if it doesn't exist. No SQL scripts needed.

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> The Vite dev server proxies `/api` requests to `http://localhost:3001`, so no CORS issues in development.

---

### 4. Deploying

**Backend → Render:**
1. Push your `server/` folder to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Set Build Command: `npm install`
4. Set Start Command: `node index.js`
5. Add all environment variables from `.env`
6. Set `CLIENT_ORIGIN` to your Vercel frontend URL

**Frontend → Vercel:**
1. Push your `client/` folder to GitHub
2. Import the repo on [Vercel](https://vercel.com)
3. Add environment variable:
   ```
   VITE_API_URL=https://your-render-backend.onrender.com/api
   ```
4. Deploy — Vercel auto-detects Vite

---

## Features

- **List all riders** with search (name or email, debounced)
- **Add rider** via modal form with validation
- **Edit rider** — pre-filled form, only updates changed fields
- **Delete rider** with confirmation dialog
- **Toast notifications** for all success/error states
- **Stats row** — total riders, average rating, result count
- Dark-mode-first design matching RideFlow brand (magenta/purple palette)
- Fully responsive — mobile-friendly table with column collapsing

---

## Requirements Checklist

| Requirement | Status |
|-------------|--------|
| HTML for structure (semantic, no inline styles) | ✅ |
| CSS via external file with classes/ids | ✅ |
| JavaScript for interactivity | ✅ |
| React with component-based architecture | ✅ |
| `components/` directory with logical breakdown | ✅ |
| Node.js + Express backend | ✅ |
| Sequelize ORM | ✅ |
| PostgreSQL database | ✅ |
| Full CRUD operations | ✅ |
| No auth required for MVP | ✅ |
