-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Create table for bot settings (System Prompt)
create table if not exists bot_settings (
  id bigint primary key generated always as identity,
  system_prompt text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table bot_settings enable row level security;

-- Create policy to allow public read access (for anon key)
create policy "Allow public read access"
  on bot_settings for select
  using (true);

-- Create policy to allow public update (for demo/MVP purposes - secure this in prod!)
create policy "Allow public update access"
  on bot_settings for update
  using (true);
  
-- Create policy to allow public insert (for initial setup)
create policy "Allow public insert access"
  on bot_settings for insert
  with check (true);

-- Insert default prompt
insert into bot_settings (system_prompt)
select 'You are a helpful assistant.'
where not exists (select 1 from bot_settings);

-- 3. Create table for Knowledge Base Items (Files)
create table if not exists knowledge_base_items (
  id uuid default gen_random_uuid() primary key,
  filename text not null,
  content_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create table for Vectors (Chunks)
create table if not exists knowledge_base_vectors (
  id uuid default gen_random_uuid() primary key,
  item_id uuid references knowledge_base_items(id) on delete cascade,
  content text not null,
  embedding vector(3072) -- Dimension for gemini-embedding-001
);

-- Index for similarity search
-- Index for similarity search (HNSW for >2000 dimensions)
create index on knowledge_base_vectors using hnsw (embedding vector_cosine_ops);

-- 5. Create RPC function for Similarity Search
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
