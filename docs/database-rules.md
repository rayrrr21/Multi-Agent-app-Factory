# Database Rules

## profiles
```sql
create policy "Public read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Allow insert for authenticated users"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Allow update own profile"
  on public.profiles for update
  using (auth.uid() = id);
```

## app_events
```sql
create policy "Insert events for authenticated users"
  on public.app_events for insert
  with check (auth.uid() = user_id);

create policy "Read own events"
  on public.app_events for select
  using (auth.uid() = user_id);
```

## user_preferences
```sql
create policy "User can read/write own preferences"
  on public.user_preferences for all
  using (auth.uid() = user_id);
```

## feature_flags
```sql
-- Feature flags are globally readable, but only admins can modify.
create policy "Read all flags"
  on public.feature_flags for select
  using (true);

create policy "Admin can modify flags"
  on public.feature_flags for all
  using (auth.role() = 'admin');
```

All tables have `row_level_security = on;` set in their definitions.
