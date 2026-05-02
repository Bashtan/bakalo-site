-- Reference schema (source of truth). Applied via migrations/0001_init.sql

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
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK(role IN ('admin', 'reviewer')),
  created_at    TEXT NOT NULL
);
