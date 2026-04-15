import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Flame, TrendingUp, Calendar } from 'lucide-react';

function fmt(d) { return d.toISOString().slice(0, 10); }

export default function Stats() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.stats().then(setData).catch(e => setErr(e.message));
  }, []);

  const { heatDays, chartData, totals } = useMemo(() => {
    if (!data) return { heatDays: [], chartData: [], totals: {} };
    const days = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = fmt(d);
      days.push({ date: key, count: data.perDay[key] || 0, dow: d.getDay() });
    }
    const chart = days.slice(-14).map(d => ({
      day: new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' }),
      date: d.date,
      checkins: d.count,
    }));
    const total = data.checkins.length;
    const activeDays = Object.keys(data.perDay).length;
    return {
      heatDays: days,
      chartData: chart,
      totals: { total, activeDays, habits: data.habits.length },
    };
  }, [data]);

  const maxCount = Math.max(1, ...heatDays.map(d => d.count));
  const intensity = (n) => {
    if (n === 0) return 'var(--bg-2)';
    const t = n / maxCount;
    if (t > 0.75) return 'var(--accent)';
    if (t > 0.5)  return 'color-mix(in srgb, var(--accent) 75%, transparent)';
    if (t > 0.25) return 'color-mix(in srgb, var(--accent) 50%, transparent)';
    return 'color-mix(in srgb, var(--accent) 30%, transparent)';
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Insights</div>
        <h1 className="font-display text-4xl font-bold">Your patterns</h1>
        <p className="text-[var(--muted)] mt-1">A view of the last 90 days of practice.</p>
      </div>

      {err && <div className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">{err}</div>}

      {!data ? (
        <div className="text-center text-[var(--muted)] py-12">Loading…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-5">
              <div className="flex items-center gap-2 text-xs text-[var(--muted)] uppercase tracking-wider">
                <Flame size={14}/> Total check-ins
              </div>
              <div className="font-display text-4xl font-bold mt-2">{totals.total}</div>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-2 text-xs text-[var(--muted)] uppercase tracking-wider">
                <Calendar size={14}/> Active days
              </div>
              <div className="font-display text-4xl font-bold mt-2">{totals.activeDays}</div>
              <div className="text-xs text-[var(--muted)] mt-1">of last 90</div>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-2 text-xs text-[var(--muted)] uppercase tracking-wider">
                <TrendingUp size={14}/> Tracked habits
              </div>
              <div className="font-display text-4xl font-bold mt-2">{totals.habits}</div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-display text-xl font-bold mb-4">90-day rhythm</h3>
            <div className="overflow-x-auto">
              <div className="grid grid-flow-col grid-rows-7 gap-1 w-fit">
                {heatDays.map((d, i) => (
                  <div
                    key={i}
                    title={`${d.date}: ${d.count} check-in${d.count !== 1 ? 's' : ''}`}
                    className="cell"
                    style={{ background: intensity(d.count) }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-[var(--muted)]">
              <span>Less</span>
              {[0, 0.3, 0.5, 0.75, 1].map((t, i) => (
                <div key={i} className="cell" style={{ background: intensity(t * maxCount) }} />
              ))}
              <span>More</span>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-display text-xl font-bold mb-4">Last 14 days</h3>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted)" fontSize={12} />
                  <YAxis stroke="var(--muted)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12 }}
                    labelStyle={{ color: 'var(--fg)' }}
                  />
                  <Bar dataKey="checkins" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
