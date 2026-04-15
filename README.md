<div align="center">

# 🌱 Habiter

### *Small acts, compounded daily.*

A modern, full-stack habit tracking app that helps you build the habits that shape who you're becoming — one check-in at a time.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Architecture](#-architecture) · [API](#-api-reference)

</div>

---

## ✨ Features

- 🔐 **Secure auth** — Email/password authentication powered by Supabase Auth
- 🎯 **Custom habits** — Create habits with custom icons, colors, categories, and weekly targets
- ✅ **One-tap check-ins** — Mark daily progress with a single tap; instant optimistic UI
- 🔥 **Streak tracking** — Automatic streak calculation to keep you motivated
- 📊 **90-day insights** — Heatmap visualization of your consistency over time
- 📈 **Trend charts** — 14-day bar chart to spot patterns
- 🌗 **Light & dark theme** — Easy on the eyes, day or night
- 📱 **Fully responsive** — Beautiful on desktop, tablet, and mobile
- 🔍 **Search & filter** — Find habits fast by name or category

---

## 🛠 Tech Stack

| Layer        | Technology                                                      |
|--------------|-----------------------------------------------------------------|
| **Frontend** | React 18 · Vite · TailwindCSS · Framer Motion · Recharts        |
| **Backend**  | Node.js · Express · @supabase/supabase-js                       |
| **Database** | Supabase (PostgreSQL) with Row Level Security                   |
| **Auth**     | Supabase Auth (JWT-based)                                       |
| **Icons**    | Lucide React                                                    |

> **Note:** This is a MERN-style stack with **Supabase (PostgreSQL)** in place of MongoDB.

---

## 📁 Project Structure

```
habiter/
├── backend/                   # Express API server
│   ├── src/
│   │   ├── index.js           # Entry point
│   │   ├── routes/            # API endpoints
│   │   │   ├── habits.js
│   │   │   └── stats.js
│   │   ├── middleware/        # Auth middleware
│   │   │   └── auth.js
│   │   ├── lib/               # Supabase admin client
│   │   │   └── supabase.js
│   │   └── utils/             # Helpers (streak calc, dates)
│   │       └── helpers.js
│   ├── .env.example
│   └── package.json
│
├── frontend/                  # React + Vite client
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx            # Router
│   │   ├── pages/             # Login, Dashboard, Stats
│   │   ├── components/        # Layout, HabitCard, HabitModal
│   │   ├── context/           # Auth & Theme providers
│   │   └── lib/               # Supabase client + API wrapper
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── database/                  # Supabase schema
│   ├── schema.sql
│   └── README.md
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm or yarn
- A free [Supabase](https://supabase.com) account

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/habiter.git
cd habiter
```

### 2️⃣ Set up the database

1. Create a new project at [supabase.com](https://supabase.com)
2. Open the **SQL Editor** in your Supabase dashboard
3. Copy and run the contents of [`database/schema.sql`](./database/schema.sql)
4. Go to **Settings → API** and copy your keys:
   - `Project URL`
   - `anon` public key
   - `service_role` secret key *(keep this private!)*

### 3️⃣ Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CLIENT_ORIGIN=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

Backend runs at **http://localhost:5000** ✓

### 4️⃣ Set up the frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:5000
```

Start the client:

```bash
npm run dev
```

Frontend runs at **http://localhost:5173** ✓

### 5️⃣ Start tracking!

Open [http://localhost:5173](http://localhost:5173), sign up, confirm your email, and start building habits.

---

## 🏗 Architecture

```
┌─────────────┐    Supabase JWT    ┌─────────────┐    service_role    ┌─────────────┐
│             │ ─────────────────> │             │ ─────────────────> │             │
│  Frontend   │                    │   Backend   │                    │  Supabase   │
│   (React)   │ <───────────────── │  (Express)  │ <───────────────── │ (Postgres)  │
│             │       JSON         │             │        SQL         │             │
└─────────────┘                    └─────────────┘                    └─────────────┘
```

**How it works:**

1. The **frontend** authenticates directly with Supabase Auth and receives a JWT.
2. Every API request to the backend includes the JWT as `Authorization: Bearer <token>`.
3. The **Express backend** verifies the JWT server-side using the Supabase service role key, then performs database operations.
4. **Row Level Security** in Postgres ensures users can only access their own data.

This pattern gives you a real backend layer — perfect for adding business logic, rate limiting, integrations, or webhooks — while still leveraging Supabase's managed Postgres and Auth.

---

## 📡 API Reference

All endpoints require an `Authorization: Bearer <supabase-jwt>` header (except health check).

| Method   | Endpoint                  | Description                   |
|----------|---------------------------|-------------------------------|
| `GET`    | `/api/health`             | Health check (no auth)        |
| `GET`    | `/api/habits`             | List habits with streaks      |
| `POST`   | `/api/habits`             | Create a new habit            |
| `PUT`    | `/api/habits/:id`         | Update a habit                |
| `DELETE` | `/api/habits/:id`         | Delete a habit                |
| `POST`   | `/api/habits/:id/toggle`  | Toggle today's check-in       |
| `GET`    | `/api/stats`              | Last 90 days of check-in data |

### Example: Create a habit

```bash
curl -X POST http://localhost:5000/api/habits \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Read for 20 minutes",
    "icon": "📚",
    "color": "#c97b5a",
    "category": "Mind",
    "target_per_week": 7
  }'
```

---

## 🗄 Database Schema

Two tables protected by Row Level Security:

**`habits`** — User-owned habit definitions
- `id`, `user_id`, `name`, `description`, `icon`, `color`, `category`, `frequency`, `target_per_week`, `created_at`

**`checkins`** — One row per habit per day completed
- `id`, `habit_id`, `user_id`, `date`, `created_at`
- Unique constraint on `(habit_id, date)` prevents duplicates

See [`database/schema.sql`](./database/schema.sql) for the full schema.

---

## 🎨 Design Philosophy

Habiter uses a warm, earthy palette — cream, clay, and moss — paired with **Fraunces** (display) and **Manrope** (body) typography. The aesthetic favors calm focus over the typical SaaS dashboard look, because building habits is a slow, intentional practice.

To customize the theme, edit the CSS variables in [`frontend/src/index.css`](./frontend/src/index.css).

---

## 🛣 Roadmap

- [ ] Habit reminders via email or push notifications
- [ ] Weekly/monthly progress reports
- [ ] Habit templates and inspiration library
- [ ] Social features — accountability partners
- [ ] Mobile app (React Native)
- [ ] Export data as CSV / JSON
- [ ] Custom habit frequency (e.g., 3x per week)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) — for the Postgres + Auth platform
- [Lucide](https://lucide.dev) — for the icon set
- [Framer Motion](https://www.framer.com/motion/) — for smooth animations
- [Recharts](https://recharts.org/) — for the stats visualizations

---

<div align="center">

**Built for everyone working on becoming a little better, every day.**

Made with love by N S Balaji, Kavya Reddy, Utpal Raj
⭐ Star this repo if you found it helpful!

</div>
