create table if not exists processed_messages (
  message_id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Optional: Periodic cleanup (if you have pg_cron or similar, or just manual)
-- delete from processed_messages where created_at < now() - interval '1 day';
