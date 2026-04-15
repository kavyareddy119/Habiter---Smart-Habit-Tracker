-- Run this in Supabase SQL Editor

create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  icon text default '✨',
  color text default '#8b5cf6',
  category text default 'General',
  frequency text default 'daily',
  target_per_week int default 7,
  created_at timestamptz default now()
);

create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  created_at timestamptz default now(),
  unique (habit_id, date)
);

alter table habits enable row level security;
alter table checkins enable row level security;

drop policy if exists "users manage own habits" on habits;
create policy "users manage own habits" on habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users manage own checkins" on checkins;
create policy "users manage own checkins" on checkins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists habits_user_idx on habits(user_id);
create index if not exists checkins_user_date_idx on checkins(user_id, date);
create index if not exists checkins_habit_date_idx on checkins(habit_id, date);
