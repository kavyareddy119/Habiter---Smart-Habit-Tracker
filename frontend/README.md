# Frontend

React + Vite + TailwindCSS + Framer Motion + Recharts.

## Structure

```
frontend/
├── src/
│   ├── main.jsx
│   ├── App.jsx                   # router
│   ├── index.css                 # Tailwind + theme tokens
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── Stats.jsx
│   ├── components/
│   │   ├── Layout.jsx            # sidebar + mobile bar
│   │   ├── HabitCard.jsx
│   │   └── HabitModal.jsx        # create / edit
│   ├── context/
│   │   ├── AuthContext.jsx       # Supabase auth state
│   │   └── ThemeContext.jsx      # light / dark
│   └── lib/
│       ├── supabase.js           # browser client
│       └── api.js                # backend fetch wrapper
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Setup

```bash
cd frontend
npm install
cp .env.example .env       # fill in Supabase URL, anon key, API URL
npm run dev
```

Runs on `http://localhost:5173`.

## Pages

- **/login** — sign in / sign up (Supabase Auth)
- **/** — Dashboard: today's habits, check-in toggles, search, filters
- **/stats** — 90-day heatmap and 14-day bar chart
