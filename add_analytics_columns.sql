
-- The API tries to select: user_id, username, user_name, profile_pic
-- But our previous create script only had: user_id, is_paused, last_interaction, updated_at

alter table conversation_states 
add column if not exists username text,
add column if not exists user_name text,
add column if not exists profile_pic text,
add column if not exists last_message_at timestamp with time zone default timezone('utc'::text, now());

-- Also index the sort column
create index if not exists idx_conversation_states_last_message_at on conversation_states(last_message_at);
