-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Table to store the bot 'persona' or system prompt
create table if not exists bot_settings (
  id bigint primary key generated always as identity,
  system_prompt text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS) is good practice, though we use Service Role key in backend
alter table bot_settings enable row level security;

-- Insert a default row if not exists
insert into bot_settings (system_prompt)
select 'You are a helpful assistant.'
where not exists (select 1 from bot_settings);

-- Table to store metadata files (PDFs, text files) uploaded to KB
create table if not exists knowledge_base_items (
  id uuid default gen_random_uuid() primary key,
  filename text not null,
  content_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table to store the actual text chunks and their vector embeddings
create table if not exists knowledge_base_vectors (
  id uuid default gen_random_uuid() primary key,
  item_id uuid references knowledge_base_items(id) on delete cascade,
  content text not null,
  embedding vector(3072) -- Dimension for Gemini models/gemini-embedding-001
);

-- Index for faster vector similarity search
create index on knowledge_base_vectors using hnsw (embedding vector_cosine_ops);
