import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const since = new Date();
  since.setDate(since.getDate() - 89);
  const sinceISO = since.toISOString().slice(0, 10);

  const { data: checkins, error } = await supabase
    .from('checkins')
    .select('date, habit_id')
    .eq('user_id', userId)
    .gte('date', sinceISO);
  if (error) return res.status(500).json({ error: error.message });

  const { data: habits } = await supabase
    .from('habits').select('id, name, color').eq('user_id', userId);

  const perDay = {};
  for (const c of checkins) perDay[c.date] = (perDay[c.date] || 0) + 1;

  res.json({ checkins, perDay, habits });
});

export default router;
