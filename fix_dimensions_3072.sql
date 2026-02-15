
-- 1. Drop existing index
drop index if exists knowledge_base_vectors_embedding_idx;

-- 2. Alter the column type to 3072 dimensions
-- NOTE: This will fail if there is existing data with incompatible dimensions.
-- Since the user likely has 0 valid embeddings or dropped the table, this might work if empty.
-- If it fails, we need to TRUNCATE correct?
-- To be safe, let's truncate if it fails, or user can drop table.
-- But let's try ALTER first.
alter table knowledge_base_vectors 
alter column embedding type vector(3072);

-- 3. Update the matching function
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

-- 4. Create the index again (IVFFlat limit is 2000 dimensions usually!)
-- WAIT. The user originally had error: "column cannot have more than 2000 dimensions for ivfflat index".
-- If dimensions are 3072, we CANNOT use ivfflat on the vector directly with standard lists.
-- We must use HNSW (if supported) or NO index (for small datasets) or likely just HNSW.
-- Supabase supports HNSW.
-- Let's change to HNSW index.

create index on knowledge_base_vectors using hnsw (embedding vector_cosine_ops);
