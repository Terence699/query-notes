-- 1. 创建 notes 表
CREATE TABLE notes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. 为 notes 表启用行级安全 (RLS)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- 3. 创建策略：用户只能查看和操作自己的笔记
CREATE POLICY "Allow individual access"
ON notes
FOR ALL
USING (auth.uid() = user_id);

-- 4. 创建一个函数，用于在更新笔记时自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. 创建一个触发器，在每次更新 notes 表中的行时调用上述函数
CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
