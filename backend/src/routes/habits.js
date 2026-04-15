import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';
import { todayISO, calcStreak } from '../utils/helpers.js';

const router = Router();

// List habits with today's status + streak
router.get('/', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { data: habits, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });

  const { data: checkins, error: cErr } = await supabase
    .from('checkins')
    .select('habit_id, date')
    .eq('user_id', userId);
  if (cErr) return res.status(500).json({ error: cErr.message });

  const today = todayISO();
  const byHabit = {};
  for (const c of checkins) (byHabit[c.habit_id] ||= []).push(c.date);

  const enriched = habits.map(h => {
    const dates = byHabit[h.id] || [];
    return {
      ...h,
      completedToday: dates.includes(today),
      streak: calcStreak(dates),
      totalCheckins: dates.length,
      recentDates: dates.slice(-30),
    };
  });

  res.json(enriched);
});

// Create
router.post('/', requireAuth, async (req, res) => {
  const { name, description, icon, color, category, frequency, target_per_week } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  const { data, error } = await supabase
    .from('habits')
    .insert({
      user_id: req.user.id,
      name,
      description: description || null,
      icon: icon || '✨',
      color: color || '#8b5cf6',
      category: category || 'General',
      frequency: frequency || 'daily',
      target_per_week: target_per_week || 7,
    })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Update
router.put('/:id', requireAuth, async (req, res) => {
  const updates = (({ name, description, icon, color, category, frequency, target_per_week }) =>
    ({ name, description, icon, color, category, frequency, target_per_week }))(req.body);
  Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k]);

  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Delete
router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// Toggle today's check-in
router.post('/:id/toggle', requireAuth, async (req, res) => {
  const habitId = req.params.id;
  const userId = req.user.id;
  const date = req.body?.date || todayISO();

  const { data: habit, error: hErr } = await supabase
    .from('habits').select('id').eq('id', habitId).eq('user_id', userId).single();
  if (hErr || !habit) return res.status(404).json({ error: 'Habit not found' });

  const { data: existing } = await supabase
    .from('checkins').select('id').eq('habit_id', habitId).eq('date', date).maybeSingle();

  if (existing) {
    await supabase.from('checkins').delete().eq('id', existing.id);
    return res.json({ checked: false });
  }
  const { error: iErr } = await supabase
    .from('checkins').insert({ habit_id: habitId, user_id: userId, date });
  if (iErr) return res.status(500).json({ error: iErr.message });
  res.json({ checked: true });
});

export default router;
