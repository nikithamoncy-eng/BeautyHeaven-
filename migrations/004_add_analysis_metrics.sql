-- Add analysis column to conversation_states
alter table conversation_states 
add column if not exists analysis jsonb;

-- Example structure of analysis jsonb:
-- {
--   "sentiment": "positive" | "neutral" | "negative",
--   "topics": ["pricing", "availability"],
--   "summary": "User asked about pricing...",
--   "score": 85 // 0-100 lead score
-- }
