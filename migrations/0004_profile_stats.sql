CREATE TABLE IF NOT EXISTS profile_stats (
  platform   TEXT NOT NULL,
  stat_key   TEXT NOT NULL,
  stat_value TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (platform, stat_key)
);
