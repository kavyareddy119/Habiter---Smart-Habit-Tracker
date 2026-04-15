import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, LogOut, Sun, Moon, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const navItem = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
      isActive ? 'bg-[var(--accent)] text-white shadow-sm' : 'hover:bg-[var(--bg-2)] text-[var(--fg)]'
    }`;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--card)] hidden md:flex flex-col p-5">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent)] grid place-items-center">
            <Sprout size={20} className="text-white" />
          </div>
          <div>
            <div className="font-display text-xl font-bold leading-none">Habiter</div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--muted)]">habit tracker</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          <NavLink to="/" end className={navItem}>
            <LayoutDashboard size={18} /> Today
          </NavLink>
          <NavLink to="/stats" className={navItem}>
            <BarChart3 size={18} /> Insights
          </NavLink>
        </nav>

        <div className="mt-auto space-y-2">
          <button onClick={toggle} className="btn btn-ghost w-full justify-start">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <div className="card p-3">
            <div className="text-xs text-[var(--muted)] truncate">{user?.email}</div>
            <button
              onClick={async () => { await signOut(); navigate('/login'); }}
              className="mt-2 text-xs flex items-center gap-1.5 text-[var(--accent)] hover:underline"
            >
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-[var(--card)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] grid place-items-center">
            <Sprout size={16} className="text-white" />
          </div>
          <span className="font-display font-bold">Habiter</span>
        </div>
        <div className="flex items-center gap-2">
          <NavLink to="/" end className={({isActive}) => `p-2 rounded-lg ${isActive ? 'bg-[var(--bg-2)]' : ''}`}>
            <LayoutDashboard size={18} />
          </NavLink>
          <NavLink to="/stats" className={({isActive}) => `p-2 rounded-lg ${isActive ? 'bg-[var(--bg-2)]' : ''}`}>
            <BarChart3 size={18} />
          </NavLink>
          <button onClick={toggle} className="p-2 rounded-lg">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={async () => { await signOut(); navigate('/login'); }} className="p-2 rounded-lg">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <main className="flex-1 md:p-8 p-4 pt-20 md:pt-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
