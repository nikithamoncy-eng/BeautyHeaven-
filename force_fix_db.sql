
-- NUCLEAR OPTION: Identify and drop ANY index on knowledge_base_vectors
do $$
declare
  r record;
begin
  for r in (
    select indexname
    from pg_indexes
    where tablename = 'knowledge_base_vectors'
    and indexname not like '%pkey' -- Exclude primary key
  ) loop
    execute 'drop index if exists ' || quote_ident(r.indexname);
  end loop;
end $$;

-- Now that ALL indexes are gone, we can safely alter the column
alter table knowledge_base_vectors 
alter column embedding type vector(3072);

-- Update the function
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

-- Create the correct index
create index on knowledge_base_vectors using hnsw (embedding vector_cosine_ops);
