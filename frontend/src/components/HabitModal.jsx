import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ICONS = ['✨','💪','📚','🧘','🏃','💧','🥗','😴','🎨','🎵','✍️','🌱','☀️','🧠','💻','🚭'];
const COLORS = ['#c97b5a','#3d5a3a','#8b5cf6','#0ea5e9','#ec4899','#eab308','#14b8a6','#f97316'];
const CATEGORIES = ['General','Health','Mind','Learning','Creativity','Social'];

export default function HabitModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    name: '', description: '', icon: '✨', color: '#c97b5a',
    category: 'General', frequency: 'daily', target_per_week: 7,
  });

  useEffect(() => {
    if (initial) setForm(f => ({ ...f, ...initial }));
    else setForm({ name: '', description: '', icon: '✨', color: '#c97b5a', category: 'General', frequency: 'daily', target_per_week: 7 });
  }, [initial, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 grid place-items-center p-4"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="card w-full max-w-md p-6 max-h-[90vh] overflow-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-2xl font-bold">{initial ? 'Edit habit' : 'New habit'}</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--bg-2)]"><X size={18}/></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Name</label>
                <input className="input mt-1" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Read for 20 minutes" />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Description</label>
                <input className="input mt-1" value={form.description || ''} onChange={e => set('description', e.target.value)} placeholder="Optional note" />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Icon</label>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {ICONS.map(i => (
                    <button key={i} onClick={() => set('icon', i)}
                      className={`w-9 h-9 rounded-lg text-lg grid place-items-center transition ${form.icon === i ? 'ring-2 ring-[var(--accent)] bg-[var(--bg-2)]' : 'hover:bg-[var(--bg-2)]'}`}
                    >{i}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Color</label>
                <div className="flex gap-2 mt-2">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => set('color', c)}
                      style={{ background: c }}
                      className={`w-8 h-8 rounded-full transition ${form.color === c ? 'ring-2 ring-offset-2 ring-[var(--fg)] ring-offset-[var(--card)]' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Category</label>
                  <select className="input mt-1" value={form.category} onChange={e => set('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Target / week</label>
                  <input type="number" min={1} max={7} className="input mt-1" value={form.target_per_week} onChange={e => set('target_per_week', +e.target.value)} />
                </div>
              </div>

              <button
                disabled={!form.name.trim()}
                onClick={() => onSave(form)}
                className="btn btn-primary w-full disabled:opacity-50"
              >
                {initial ? 'Save changes' : 'Create habit'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
