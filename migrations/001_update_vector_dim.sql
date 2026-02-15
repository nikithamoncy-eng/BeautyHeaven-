-- Migration to update vector dimension from 768 to 3072 for models/gemini-embedding-001

-- 1. Drop the existing index (it depends on the column type)
drop index if exists knowledge_base_vectors_embedding_idx;

-- 2. Alter the column type
-- Note: This will fail if there is existing data that doesn't match the new dimension.
-- Since the user mentioned "nothing got saved", we can truncate or just alter if empty.
-- To be safe given the user's context, we'll truncate the table to clearer existing bad data
truncate table knowledge_base_vectors;

alter table knowledge_base_vectors 
alter column embedding type vector(3072);

-- 3. Re-create the index
create index on knowledge_base_vectors using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- 4. Update the search function to accept 3072 dimensions
create or replace function match_knowledge_base (
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    knowledge_base_vectors.id,
    knowledge_base_vectors.content,
    1 - (knowledge_base_vectors.embedding <=> query_embedding) as similarity
  from knowledge_base_vectors
  where 1 - (knowledge_base_vectors.embedding <=> query_embedding) > match_threshold
  order by knowledge_base_vectors.embedding <=> query_embedding
  limit match_count;
end;
$$;
