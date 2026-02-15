
create table if not exists conversation_states (
  user_id text primary key,
  is_paused boolean default false,
  last_message_at timestamp with time zone default timezone('utc'::text, now()),
  user_name text, -- Optional, to store display name if available
  username text, -- Instagram handle (e.g., @user)
  profile_pic text -- URL to profile picture
);

-- Index for sorting by last active
create index if not exists idx_conversation_states_last_message_at on conversation_states (last_message_at);

-- Enable RLS (and allow all for this demo app, or restrict as needed)
alter table conversation_states enable row level security;

create policy "Allow public access to conversation_states"
on conversation_states for all
using (true)
with check (true);
