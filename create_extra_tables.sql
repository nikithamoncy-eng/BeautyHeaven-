
-- 1. Conversation History
create table if not exists conversation_history (
  id bigint primary key generated always as identity,
  user_id text not null, -- Instagram IGSID or internal ID
  role text not null,    -- 'user' or 'assistant'
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster retrieval by user
create index if not exists idx_conversation_history_user_id on conversation_history(user_id);

-- 2. Conversation States (for tracking pause/human takeover)
create table if not exists conversation_states (
  user_id text primary key, -- One state per user
  is_paused boolean default false,
  last_interaction timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Leads (captured from chat)
create table if not exists leads (
  id bigint primary key generated always as identity,
  user_id text not null,
  email text,
  phone text,
  source_message text,
  status text default 'new', -- new, contacted, closed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Processed Messages (Deduplication for Webhooks)
create table if not exists processed_messages (
  id text primary key, -- Instagram Message ID
  processed_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policies (Optional but recommended - simplifying for initial setup to allow public/service role)
alter table conversation_history enable row level security;
alter table conversation_states enable row level security;
alter table leads enable row level security;
alter table processed_messages enable row level security;

-- For now, allow all access (Service Role bypasses this anyway, but good for client-side debugging if needed)
create policy "Allow public access to history" on conversation_history for all using (true);
create policy "Allow public access to states" on conversation_states for all using (true);
create policy "Allow public access to leads" on leads for all using (true);
create policy "Allow public access to processed_messages" on processed_messages for all using (true);
