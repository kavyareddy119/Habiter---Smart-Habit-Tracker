import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import habitsRouter from './routes/habits.js';
import statsRouter from './routes/stats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/habits', habitsRouter);
app.use('/api/stats', statsRouter);

app.listen(PORT, () => {
  console.log(`✓ Backend running on http://localhost:${PORT}`);
});
