-- 0005_research_impact.sql
-- Adds trend_pct to profile_stats and a history snapshot table for charts.

ALTER TABLE profile_stats ADD COLUMN trend_pct TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS profile_stats_history (
  platform   TEXT    NOT NULL,
  stat_key   TEXT    NOT NULL,
  stat_year  INTEGER NOT NULL,
  stat_value TEXT    NOT NULL,
  saved_at   TEXT    NOT NULL,
  PRIMARY KEY (platform, stat_key, stat_year)
);

CREATE INDEX IF NOT EXISTS idx_psh_platform_key_year
  ON profile_stats_history (platform, stat_key, stat_year);
