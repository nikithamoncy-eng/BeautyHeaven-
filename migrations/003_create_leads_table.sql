-- Create leads table
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  user_id text not null references conversation_states(user_id),
  email text,
  phone text,
  status text default 'new', -- new, contacted, qualified, lost
  source_message text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table leads enable row level security;

-- Create policy to allow all access (for this demo)
create policy "Allow public access to leads"
  on leads for all
  using (true)
  with check (true);

-- Create index for faster lookups
create index if not exists leads_user_id_idx on leads(user_id);
create index if not exists leads_status_idx on leads(status);
