-- Seed data. Run after migrations:
--   wrangler d1 execute bakalo-db --file=seed.sql

INSERT OR IGNORE INTO users (id, email, password_hash, role, created_at) VALUES (
  'user_admin_01',
  'bakalo.science@gmail.com',
  'pbkdf2:sha256:100000:33a19cd609976674e245930cff21ebe7:KQYy6ORWwriN4BZQJV15Znu7lB2msDBBRQZDNguGsWg=',
  'admin',
  '2026-05-02T00:00:00.000Z'
);

-- Featured paper
INSERT OR IGNORE INTO articles (id, title, url, category, description, year, is_featured, sort_order, ssrn_url, doi_url, tags, created_at) VALUES (
  'art_featured_01',
  'Integrated Financial Security Diagnostics System: Concept, Methodological Tools and Verification of Results',
  '#',
  'Research & Methodology',
  'Introduces a unified diagnostic framework for assessing financial security across banking systems. Develops original methodological tools and verifies results against empirical data — establishing a foundation for risk-based governance and institutional resilience assessment.',
  2024,
  1,
  1,
  '',
  '',
  'Financial Stability,Governance,Systemic Risk,Research & Methodology',
  '2026-05-02T00:00:00.000Z'
);

-- U.S. Banking System — Core Studies
INSERT OR IGNORE INTO articles (id, title, url, category, description, year, is_featured, sort_order, ssrn_url, doi_url, tags, created_at) VALUES (
  'art_us_01',
  'Regulatory Architecture and Quantitative Indicators of Financial Security in the U.S. Banking System',
  '#',
  'U.S. Banking System',
  'Maps the U.S. banking regulatory architecture and constructs a set of quantitative indicators for measuring financial security. Demonstrates how regulatory design and supervisory mechanisms translate into measurable system-level resilience.',
  2024,
  0,
  1,
  '',
  '',
  'Banking Regulation,Financial Stability,Systemic Risk',
  '2026-05-02T00:00:01.000Z'
);

INSERT OR IGNORE INTO articles (id, title, url, category, description, year, is_featured, sort_order, ssrn_url, doi_url, tags, created_at) VALUES (
  'art_us_02',
  'Financial Security of Banking Systems: Conceptual Framework, Indicators, and Evidence from the United States',
  '#',
  'U.S. Banking System',
  'Develops a conceptual framework for evaluating banking system financial security and validates it using U.S. empirical evidence. Bridges theoretical governance models with data-driven institutional risk assessment.',
  2024,
  0,
  2,
  '',
  '',
  'Financial Stability,Governance,Macroprudential Analysis',
  '2026-05-02T00:00:02.000Z'
);

INSERT OR IGNORE INTO articles (id, title, url, category, description, year, is_featured, sort_order, ssrn_url, doi_url, tags, created_at) VALUES (
  'art_us_03',
  'Strengthening Financial Security of the U.S. Banking Sector: Regulatory Tools and Practical Risk Mitigation Strategies',
  '#',
  'U.S. Banking System',
  'Identifies and evaluates regulatory instruments and practical strategies for enhancing financial security and mitigating systemic risk in the U.S. banking sector. Provides implementation-oriented recommendations aligned with existing supervisory frameworks.',
  2024,
  0,
  3,
  '',
  '',
  'Banking Regulation,Systemic Risk,Regulatory Resilience',
  '2026-05-02T00:00:03.000Z'
);

-- U.S. Banking System — Supporting Study
INSERT OR IGNORE INTO articles (id, title, url, category, description, year, is_featured, sort_order, ssrn_url, doi_url, tags, created_at) VALUES (
  'art_us_04',
  'Financial security and stability of the US banking system: comparative analysis and parallels with the Ukrainian experience',
  '#',
  'U.S. Banking System',
  'A comparative study drawing institutional parallels between U.S. banking stability mechanisms and the Ukrainian banking experience under stress conditions. Identifies governance lessons with cross-jurisdictional relevance.',
  2024,
  0,
  4,
  '',
  '',
  'Financial Stability,Institutional Risk,Governance',
  '2026-05-02T00:00:04.000Z'
);

-- Financial Stability — Comparative & Crisis-Oriented Analysis
INSERT OR IGNORE INTO articles (id, title, url, category, description, year, is_featured, sort_order, ssrn_url, doi_url, tags, created_at) VALUES (
  'art_eu_01',
  'Financial Stability of the Banking System of the European Union: Practical Aspects and Strategic Paradigms',
  '#',
  'Financial Stability',
  'Examines practical dimensions and strategic paradigms of financial stability governance in EU banking systems. Provides a comparative institutional analysis applicable to cross-border regulatory design.',
  2024,
  0,
  1,
  '',
  '',
  'Financial Stability,Macroprudential Analysis,Banking Regulation',
  '2026-05-02T00:00:05.000Z'
);

INSERT OR IGNORE INTO articles (id, title, url, category, description, year, is_featured, sort_order, ssrn_url, doi_url, tags, created_at) VALUES (
  'art_ua_01',
  'Stress Testing of the Banking System of Ukraine: Tools, Scenarios and Results in Wartime Conditions',
  '#',
  'Financial Stability',
  'Applies advanced stress-testing methodologies to the Ukrainian banking system under active wartime conditions. Evaluates institutional resilience, systemic vulnerabilities, and the efficacy of crisis-response regulatory tools.',
  2024,
  0,
  2,
  '',
  '',
  'Systemic Risk,Institutional Risk,Financial Stability',
  '2026-05-02T00:00:06.000Z'
);

-- Implementation & Recognition evidence
INSERT OR IGNORE INTO evidence (id, title, description, institution, year, evidence_url, sort_order, category, created_at) VALUES (
  'ev_clarivate_01',
  'Clarivate / Web of Science Peer Review Recognition',
  'Recognized as a peer reviewer within the Web of Science ecosystem, covering governance, economics, and financial systems research.',
  'Clarivate Analytics',
  2025,
  '',
  1,
  'Recognition',
  '2026-05-02T00:00:00.000Z'
);

INSERT OR IGNORE INTO evidence (id, title, description, institution, year, evidence_url, sort_order, category, created_at) VALUES (
  'ev_silesian_01',
  'Silesian University of Technology — International Conference',
  'Participation and contribution at the International Interdisciplinary Scientific Conference on governance and financial systems.',
  'Silesian University of Technology, Poland',
  2025,
  '',
  2,
  'Academic Participation',
  '2026-05-02T00:00:01.000Z'
);

INSERT OR IGNORE INTO evidence (id, title, description, institution, year, evidence_url, sort_order, category, created_at) VALUES (
  'ev_erasmus_01',
  'Erasmus+ Academic Mobility Activity',
  'Academic engagement under the Erasmus+ program, contributing to international research collaboration and institutional knowledge exchange.',
  'Erasmus+',
  2024,
  '',
  3,
  'Academic Participation',
  '2026-05-02T00:00:02.000Z'
);

INSERT OR IGNORE INTO evidence (id, title, description, institution, year, evidence_url, sort_order, category, created_at) VALUES (
  'ev_ostroh_01',
  'Ostroh Academy International Conference',
  'Presented research findings at the Ostroh Academy international scientific conference focused on financial governance.',
  'National University of Ostroh Academy, Ukraine',
  2024,
  '',
  4,
  'Academic Participation',
  '2026-05-02T00:00:03.000Z'
);

INSERT OR IGNORE INTO evidence (id, title, description, institution, year, evidence_url, sort_order, category, created_at) VALUES (
  'ev_catb_01',
  'Publication in Category B Peer-Reviewed Journal',
  'Research published in a Category B scientific journal recognized by the Ukrainian Ministry of Education and Science.',
  'Peer-Reviewed Academic Journal',
  2024,
  '',
  5,
  'Recognition',
  '2026-05-02T00:00:04.000Z'
);

-- Backfill categories for any existing evidence rows that predate the migration
UPDATE evidence SET category = 'Recognition'          WHERE id = 'ev_clarivate_01' AND (category IS NULL OR category = '');
UPDATE evidence SET category = 'Academic Participation' WHERE id = 'ev_silesian_01' AND (category IS NULL OR category = '');
UPDATE evidence SET category = 'Academic Participation' WHERE id = 'ev_erasmus_01'  AND (category IS NULL OR category = '');
UPDATE evidence SET category = 'Academic Participation' WHERE id = 'ev_ostroh_01'   AND (category IS NULL OR category = '');
UPDATE evidence SET category = 'Recognition'          WHERE id = 'ev_catb_01'      AND (category IS NULL OR category = '');

-- Professional Engagement
INSERT OR IGNORE INTO engagements (id, title, description, organization, year, evidence_url, sort_order, category, created_at) VALUES (
  'eng_gartner_01',
  'Gartner Security & Risk Management Summit',
  'Attended webinar on AI governance frameworks, enterprise risk management, and systemic risk in digital financial infrastructure.',
  'Gartner',
  2025,
  '',
  1,
  'AI Governance',
  '2026-05-02T00:00:00.000Z'
);

INSERT OR IGNORE INTO engagements (id, title, description, organization, year, evidence_url, sort_order, category, created_at) VALUES (
  'eng_imf_01',
  'IMF Financial Stability Training',
  'Professional development program covering macroprudential policy, systemic risk assessment frameworks, and financial stability governance.',
  'International Monetary Fund (IMF)',
  2024,
  '',
  2,
  'Continuing Education',
  '2026-05-02T00:00:01.000Z'
);

INSERT OR IGNORE INTO engagements (id, title, description, organization, year, evidence_url, sort_order, category, created_at) VALUES (
  'eng_jvi_01',
  'Joint Vienna Institute — Financial Regulation Program',
  'Completed professional training in financial regulation, supervisory frameworks, and institutional risk governance.',
  'Joint Vienna Institute',
  2024,
  '',
  3,
  'Continuing Education',
  '2026-05-02T00:00:02.000Z'
);

INSERT OR IGNORE INTO engagements (id, title, description, organization, year, evidence_url, sort_order, category, created_at) VALUES (
  'eng_deloitte_01',
  'Deloitte Professional Development — Risk & Governance',
  'Advanced training in enterprise risk management, regulatory compliance frameworks, and governance best practices.',
  'Deloitte',
  2024,
  '',
  4,
  'Continuing Education',
  '2026-05-02T00:00:03.000Z'
);

INSERT OR IGNORE INTO engagements (id, title, description, organization, year, evidence_url, sort_order, category, created_at) VALUES (
  'eng_bdf_01',
  'Banque de France — Central Banking & Stability',
  'Training program in central banking operations, financial stability oversight, and macroprudential regulatory design.',
  'Banque de France',
  2024,
  '',
  5,
  'Continuing Education',
  '2026-05-02T00:00:04.000Z'
);

INSERT OR IGNORE INTO engagements (id, title, description, organization, year, evidence_url, sort_order, category, created_at) VALUES (
  'eng_iia_01',
  'IIA — Institute of Internal Auditors Professional Engagement',
  'Active participation in IIA webinars and programs covering AI governance, internal audit standards, and risk-based audit methodology.',
  'Institute of Internal Auditors (IIA)',
  2025,
  '',
  6,
  'Audit & Cybersecurity',
  '2026-05-02T00:00:05.000Z'
);

-- Backfill categories for any existing engagement rows that predate the migration
UPDATE engagements SET category = 'AI Governance'      WHERE id = 'eng_gartner_01' AND (category IS NULL OR category = '');
UPDATE engagements SET category = 'Continuing Education' WHERE id = 'eng_imf_01'    AND (category IS NULL OR category = '');
UPDATE engagements SET category = 'Continuing Education' WHERE id = 'eng_jvi_01'    AND (category IS NULL OR category = '');
UPDATE engagements SET category = 'Continuing Education' WHERE id = 'eng_deloitte_01' AND (category IS NULL OR category = '');
UPDATE engagements SET category = 'Continuing Education' WHERE id = 'eng_bdf_01'    AND (category IS NULL OR category = '');
UPDATE engagements SET category = 'Audit & Cybersecurity' WHERE id = 'eng_iia_01'  AND (category IS NULL OR category = '');
