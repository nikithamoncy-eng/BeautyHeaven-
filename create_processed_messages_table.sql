-- Create table to store processed message IDs for idempotency
create table if not exists processed_messages (
  id bigint primary key generated always as identity,
  message_id text not null unique, -- Ensure message_id is unique
  processed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table processed_messages enable row level security;

-- Create policy to allow public read access (for anon key)
create policy "Allow public read access"
  on processed_messages for select
  using (true);

-- Create policy to allow public insert access (for anon key)
create policy "Allow public insert access"
  on processed_messages for insert
  with check (true);
