-- Create a table to store each Q&A session
CREATE TABLE qa_sessions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  note_id BIGINT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- The title can be the first question of the session
  title TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE qa_sessions ENABLE ROW LEVEL SECURITY;

-- Policies to ensure users can only access their own data
CREATE POLICY "Users can view their own QA sessions"
ON qa_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own QA sessions"
ON qa_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own QA sessions"
ON qa_sessions FOR DELETE
USING (auth.uid() = user_id);
