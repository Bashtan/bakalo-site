ALTER TABLE articles ADD COLUMN ssrn_url TEXT NOT NULL DEFAULT '';
ALTER TABLE articles ADD COLUMN doi_url  TEXT NOT NULL DEFAULT '';
ALTER TABLE articles ADD COLUMN tags     TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS evidence (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  institution  TEXT NOT NULL DEFAULT '',
  year         INTEGER,
  evidence_url TEXT NOT NULL DEFAULT '',
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS engagements (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  organization TEXT NOT NULL DEFAULT '',
  year         INTEGER,
  evidence_url TEXT NOT NULL DEFAULT '',
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL
);
