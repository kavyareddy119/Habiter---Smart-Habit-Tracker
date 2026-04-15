import { motion } from 'framer-motion';
import { Flame, Check, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const done = habit.completedToday;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 flex items-center gap-4 group relative"
    >
      <div
        className="w-12 h-12 rounded-xl grid place-items-center text-xl shrink-0"
        style={{ background: `${habit.color}20`, color: habit.color }}
      >
        {habit.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold truncate">{habit.name}</h3>
          <span className="badge">{habit.category}</span>
        </div>
        {habit.description && (
          <p className="text-xs text-[var(--muted)] truncate mt-0.5">{habit.description}</p>
        )}
        <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1">
            <Flame size={12} className="text-[var(--accent)]" />
            {habit.streak} day{habit.streak !== 1 ? 's' : ''}
          </span>
          <span>·</span>
          <span>{habit.totalCheckins} total</span>
        </div>
      </div>

      <button
        onClick={() => onToggle(habit)}
        className={`w-11 h-11 rounded-full grid place-items-center transition shrink-0 ${
          done
            ? 'text-white scale-100'
            : 'border-2 border-dashed border-[var(--border)] text-transparent hover:border-[var(--accent)] hover:text-[var(--accent)]'
        }`}
        style={done ? { background: habit.color } : {}}
        aria-label="Toggle today"
      >
        <Check size={20} strokeWidth={3} />
      </button>

      <div className="relative">
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-2)] opacity-0 group-hover:opacity-100 transition"
        >
          <MoreVertical size={16} />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-9 z-20 card p-1 shadow-lg min-w-[140px]">
              <button onClick={() => { onEdit(habit); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-[var(--bg-2)] text-left">
                <Pencil size={14} /> Edit
              </button>
              <button onClick={() => { onDelete(habit); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-red-500/10 text-red-500 text-left">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
