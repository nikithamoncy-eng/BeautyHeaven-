create table if not exists conversation_history (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_conversation_history_user_id on conversation_history (user_id);
create index if not exists idx_conversation_history_created_at on conversation_history (created_at);
