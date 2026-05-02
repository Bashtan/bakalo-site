-- Seed data. Run after migrations:
--   wrangler d1 execute bakalo-db --file=seed.sql
--
-- BEFORE DEPLOYING: replace admin email + regenerate password hash:
--   node scripts/hash-password.js <your-password>
-- Default password for local dev: changeme123

INSERT OR IGNORE INTO users (id, email, password_hash, role, created_at) VALUES (
  'user_admin_01',
  'admin@ivanbakalo.com',
  'pbkdf2:sha256:100000:e02e6d7731273dc1c7dd24d4bf1f5be1:894wbsybn1AqZEPyO9uj8M5PtU6JdneIVny/GyRX2Cc=',
  'admin',
  '2026-05-02T00:00:00.000Z'
);

-- Featured paper
INSERT OR IGNORE INTO articles (id, title, url, category, description, year, is_featured, sort_order, created_at) VALUES (
  'art_featured_01',
  'Integrated Financial Security Diagnostics System: Concept, Methodological Tools and Verification of Results',
  '#',
  'Research & Methodology',
  'A comprehensive framework for diagnosing financial security across banking systems, introducing methodological tools and empirical verification.',
  2024,
  1,
  1,
  '2026-05-02T00:00:00.000Z'
);

-- U.S. Banking System — Core Studies
INSERT OR IGNORE INTO articles (id, title, url, category, description, year, is_featured, sort_order, created_at) VALUES (
  'art_us_01',
  'Regulatory Architecture and Quantitative Indicators of Financial Security in the U.S. Banking System',
  '#',
  'U.S. Banking System',
  'Examines the regulatory framework governing U.S. banking and develops quantitative indicators for assessing financial security.',
  2024,
  0,
  1,
  '2026-05-02T00:00:01.000Z'
);

INSERT OR IGNORE INTO articles (id, title, url, category, description, year, is_featured, sort_order, created_at) VALUES (
  'art_us_02',
  'Financial Security of Banking Systems: Conceptual Framework, Indicators, and Evidence from the United States',
  '#',
  'U.S. Banking System',
  'Develops a conceptual framework for banking system financial security and tests it against U.S. empirical data.',
  2024,
  0,
  2,
  '2026-05-02T00:00:02.000Z'
);

INSERT OR IGNORE INTO articles (id, title, url, category, description, year, is_featured, sort_order, created_at) VALUES (
  'art_us_03',
  'Strengthening Financial Security of the U.S. Banking Sector: Regulatory Tools and Practical Risk Mitigation Strategies',
  '#',
  'U.S. Banking System',
  'Identifies regulatory tools and practical strategies for enhancing financial security and mitigating systemic risk in U.S. banking.',
  2024,
  0,
  3,
  '2026-05-02T00:00:03.000Z'
);

-- U.S. Banking System — Supporting Study
INSERT OR IGNORE INTO articles (id, title, url, category, description, year, is_featured, sort_order, created_at) VALUES (
  'art_us_04',
  'Financial security and stability of the US banking system: comparative analysis and parallels with the Ukrainian experience',
  '#',
  'U.S. Banking System',
  'A comparative study drawing parallels between U.S. banking stability mechanisms and the Ukrainian banking experience.',
  2024,
  0,
  4,
  '2026-05-02T00:00:04.000Z'
);

-- Comparative & Crisis-Oriented Analysis
INSERT OR IGNORE INTO articles (id, title, url, category, description, year, is_featured, sort_order, created_at) VALUES (
  'art_eu_01',
  'Financial Stability of the Banking System of the European Union: Practical Aspects and Strategic Paradigms',
  '#',
  'Financial Stability',
  'Analyzes practical dimensions and strategic frameworks underpinning financial stability in EU banking systems.',
  2024,
  0,
  1,
  '2026-05-02T00:00:05.000Z'
);

INSERT OR IGNORE INTO articles (id, title, url, category, description, year, is_featured, sort_order, created_at) VALUES (
  'art_ua_01',
  'Stress Testing of the Banking System of Ukraine: Tools, Scenarios and Results in Wartime Conditions',
  '#',
  'Financial Stability',
  'Applies stress-testing methodologies to the Ukrainian banking system under wartime conditions, evaluating resilience and systemic vulnerabilities.',
  2024,
  0,
  2,
  '2026-05-02T00:00:06.000Z'
);
