-- Create a custom type for the role in a message
CREATE TYPE qa_role AS ENUM ('user', 'assistant');

-- Create a table to store each message within a session
CREATE TABLE qa_messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  session_id BIGINT NOT NULL REFERENCES qa_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role qa_role NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE qa_messages ENABLE ROW LEVEL SECURITY;

-- Policies to ensure users can only access their own data
CREATE POLICY "Users can view their own QA messages"
ON qa_messages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own QA messages"
ON qa_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);