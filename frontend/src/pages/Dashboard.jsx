import { useEffect, useMemo, useState } from 'react';
import { Plus, Sparkles, Search } from 'lucide-react';
import { api } from '../lib/api';
import HabitCard from '../components/HabitCard.jsx';
import HabitModal from '../components/HabitModal.jsx';

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.habits();
      setHabits(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const categories = useMemo(() => ['All', ...new Set(habits.map(h => h.category))], [habits]);

  const filtered = habits.filter(h =>
    (filter === 'All' || h.category === filter) &&
    (h.name.toLowerCase().includes(query.toLowerCase()))
  );

  const completedToday = habits.filter(h => h.completedToday).length;
  const completionPct = habits.length ? Math.round((completedToday / habits.length) * 100) : 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const toggle = async (habit) => {
    setHabits(hs => hs.map(h => h.id === habit.id ? {
      ...h,
      completedToday: !h.completedToday,
      streak: h.completedToday ? Math.max(0, h.streak - 1) : h.streak + 1,
      totalCheckins: h.totalCheckins + (h.completedToday ? -1 : 1),
    } : h));
    try { await api.toggle(habit.id); load(); }
    catch (e) { setErr(e.message); load(); }
  };

  const save = async (form) => {
    try {
      if (editing) await api.updateHabit(editing.id, form);
      else await api.createHabit(form);
      setModalOpen(false); setEditing(null);
      load();
    } catch (e) { setErr(e.message); }
  };

  const remove = async (habit) => {
    if (!confirm(`Delete "${habit.name}"? This removes all check-ins.`)) return;
    try { await api.deleteHabit(habit.id); load(); }
    catch (e) { setErr(e.message); }
  };

  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-1">{today}</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight">
            {greeting()}<span className="text-[var(--accent)]">.</span>
          </h1>
          <p className="text-[var(--muted)] mt-1">
            {habits.length === 0
              ? "Plant your first habit to begin."
              : completedToday === habits.length
                ? `Beautifully done — all ${habits.length} habits complete today.`
                : `${completedToday} of ${habits.length} habits done today.`}
          </p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn btn-primary">
          <Plus size={16} /> New habit
        </button>
      </div>

      {habits.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="card p-4">
            <div className="text-xs text-[var(--muted)] uppercase tracking-wider">Today</div>
            <div className="font-display text-3xl font-bold mt-1">{completionPct}<span className="text-lg">%</span></div>
            <div className="mt-3 h-1.5 bg-[var(--bg-2)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${completionPct}%` }} />
            </div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-[var(--muted)] uppercase tracking-wider">Active habits</div>
            <div className="font-display text-3xl font-bold mt-1">{habits.length}</div>
            <div className="text-xs text-[var(--muted)] mt-3">{categories.length - 1} categories</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-[var(--muted)] uppercase tracking-wider">Best streak</div>
            <div className="font-display text-3xl font-bold mt-1">{habits.reduce((m, h) => Math.max(m, h.streak), 0)}</div>
            <div className="text-xs text-[var(--muted)] mt-3">days running</div>
          </div>
        </div>
      )}

      {habits.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input className="input pl-9" placeholder="Search habits…" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  filter === c ? 'bg-[var(--accent)] text-white' : 'bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--bg-2)]'
                }`}
              >{c}</button>
            ))}
          </div>
        </div>
      )}

      {err && <div className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">{err}</div>}

      {loading ? (
        <div className="text-center text-[var(--muted)] py-12">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-2)] grid place-items-center mx-auto mb-4">
            <Sparkles size={28} className="text-[var(--accent)]" />
          </div>
          <h3 className="font-display text-2xl font-bold">
            {habits.length === 0 ? 'A blank canvas' : 'Nothing matches'}
          </h3>
          <p className="text-[var(--muted)] mt-1 mb-5 max-w-sm mx-auto">
            {habits.length === 0
              ? 'Start with one habit you can do tomorrow. Small is sustainable.'
              : 'Try a different category or search term.'}
          </p>
          {habits.length === 0 && (
            <button onClick={() => setModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Create your first habit
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(h => (
            <HabitCard key={h.id} habit={h}
              onToggle={toggle}
              onEdit={(habit) => { setEditing(habit); setModalOpen(true); }}
              onDelete={remove}
            />
          ))}
        </div>
      )}

      <HabitModal
        open={modalOpen}
        initial={editing}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={save}
      />
    </div>
  );
}
