export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function calcStreak(dates) {
  const set = new Set(dates);
  let streak = 0;
  const d = new Date();
  if (!set.has(d.toISOString().slice(0, 10))) {
    d.setDate(d.getDate() - 1);
  }
  while (set.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
