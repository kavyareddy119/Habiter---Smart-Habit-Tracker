# Backend

Node.js + Express + Supabase JS client.

## Structure

```
backend/
├── src/
│   ├── index.js           # entrypoint, mounts routes
│   ├── routes/
│   │   ├── habits.js      # CRUD + toggle check-in
│   │   └── stats.js       # 90-day stats
│   ├── middleware/
│   │   └── auth.js        # JWT verification via Supabase
│   ├── lib/
│   │   └── supabase.js    # Supabase admin client
│   └── utils/
│       └── helpers.js     # date + streak utilities
├── .env.example
└── package.json
```

## Setup

```bash
cd backend
npm install
cp .env.example .env       # fill in Supabase URL + service_role key
npm run dev
```

Runs on `http://localhost:5000`.

## Endpoints

All require `Authorization: Bearer <supabase-jwt>` header.

| Method | Path                       | Description              |
|--------|----------------------------|--------------------------|
| GET    | `/api/health`              | Health check (no auth)   |
| GET    | `/api/habits`              | List habits + streaks    |
| POST   | `/api/habits`              | Create habit             |
| PUT    | `/api/habits/:id`          | Update habit             |
| DELETE | `/api/habits/:id`          | Delete habit             |
| POST   | `/api/habits/:id/toggle`   | Toggle today's check-in  |
| GET    | `/api/stats`               | Last 90 days of data     |
