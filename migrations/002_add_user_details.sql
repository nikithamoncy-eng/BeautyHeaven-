-- Migration to add user details to conversation_states table

ALTER TABLE conversation_states
ADD COLUMN IF NOT EXISTS username text,
ADD COLUMN IF NOT EXISTS profile_pic text;

-- Optional: Update comment for user_name if needed
COMMENT ON COLUMN conversation_states.user_name IS 'Display name from Instagram';
COMMENT ON COLUMN conversation_states.username IS 'Instagram handle (e.g., @user)';
COMMENT ON COLUMN conversation_states.profile_pic IS 'URL to profile picture';
