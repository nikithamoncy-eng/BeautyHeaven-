
-- 1. Drop existing index if it exists
drop index if exists knowledge_base_vectors_embedding_idx;

-- 2. Update column to 3072 dimensions
-- We use a transaction or just run commands sequentially.
-- If this fails due to data, you might need to: truncate table knowledge_base_vectors;
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

-- 4. Create HNSW index (REQUIRED for 3072 dimensions, ivfflat only supports up to 2000)
create index on knowledge_base_vectors using hnsw (embedding vector_cosine_ops);
