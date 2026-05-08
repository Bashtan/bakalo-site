-- Reference schema (source of truth). Applied via migrations/.

CREATE TABLE IF NOT EXISTS articles (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  url         TEXT NOT NULL DEFAULT '#',
  category    TEXT NOT NULL CHECK(category IN (
                'U.S. Banking System',
                'Financial Stability',
                'Risk & Regulation',
                'Research & Methodology'
              )),
  description TEXT NOT NULL DEFAULT '',
  year        INTEGER,
  is_featured INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  ssrn_url    TEXT NOT NULL DEFAULT '',
  doi_url     TEXT NOT NULL DEFAULT '',
  tags        TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK(role IN ('admin', 'reviewer')),
  created_at    TEXT NOT NULL
);

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
