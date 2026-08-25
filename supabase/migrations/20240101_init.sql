-- supabase/migrations/20240101_init.sql
-- Create profiles table
create table public.profiles (
  id uuid primary key default auth.uid(),
  email text not null,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Create app_events table
create table public.app_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  event_name text not null,
  payload jsonb,
  created_at timestamp with time zone default now()
);

-- Create user_preferences table
create table public.user_preferences (
  user_id uuid primary key references public.profiles(id),
  preferences jsonb default '{}'
);

-- Create feature_flags table
create table public.feature_flags (
  key text primary key,
  enabled boolean not null default false,
  description text
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.app_events enable row level security;
alter table public.user_preferences enable row level security;
alter table public.feature_flags enable row level security;
