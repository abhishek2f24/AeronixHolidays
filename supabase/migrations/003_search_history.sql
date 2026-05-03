-- Search history: saves every flight/hotel search a user makes
-- Used for: Recent Searches on dashboard, personalization, analytics
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS search_history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('flight','hotel')),
  label         TEXT NOT NULL,
  href          TEXT NOT NULL,
  -- flight fields
  from_code     CHAR(3),
  to_code       CHAR(3),
  depart_date   DATE,
  return_date   DATE,
  cabin         TEXT,
  -- hotel fields
  destination   TEXT,
  check_in      DATE,
  check_out     DATE,
  -- shared
  adults        INT DEFAULT 1,
  rooms         INT DEFAULT 1,
  results_count INT,
  searched_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_history_user_time
  ON search_history(user_id, searched_at DESC);

-- Row-level security: users can only see their own searches
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own searches"
  ON search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own searches"
  ON search_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own searches"
  ON search_history FOR DELETE
  USING (auth.uid() = user_id);
