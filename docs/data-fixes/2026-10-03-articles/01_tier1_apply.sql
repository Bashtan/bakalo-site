-- TIER 1 (recommended): remove hidden duplicates, switch featured paper, drop dead links, fix defects, set order
-- 1a. delete 3 hidden duplicate rows (all unreachable from the admin UI; same papers exist elsewhere in the table)
DELETE FROM articles WHERE id IN ('art_us_01', 'art_us_04', 'art_ua_01');
-- 1b. exactly one featured row: Governance-Driven Model (SSRN 6720603) per the 06.05.2026 brief
UPDATE articles SET is_featured = 0 WHERE id <> 'art_1780454487617_doj8g';
UPDATE articles SET is_featured = 1, sort_order = 0 WHERE id = 'art_1780454487617_doj8g';
-- 1c. dead placeholder links ('#') -> empty so no button renders
UPDATE articles SET ssrn_url = '' WHERE id = 'art_1783015302967_9z5at' AND ssrn_url = '#';
UPDATE articles SET ssrn_url = '' WHERE id = 'art_1780456399539_ceb6u' AND ssrn_url = '#';
UPDATE articles SET ssrn_url = '' WHERE id = 'art_1780454885593_8l7pe' AND ssrn_url = '#';
UPDATE articles SET ssrn_url = '' WHERE id = 'art_1780455693383_1e867' AND ssrn_url = '#';
UPDATE articles SET ssrn_url = '' WHERE id = 'art_1780456604588_qhjse' AND ssrn_url = '#';
UPDATE articles SET doi_url = '' WHERE id = 'art_1780456604588_qhjse' AND doi_url = '#';
-- 1d. description defects: glued words (PDF copy-paste) and a raw URL pasted into the description field
UPDATE articles SET description = 'The paper examines financial security as a core component of the U.S. banking system stability. It analyzes key indicators, regulatory frameworks, and recent challenges, including interest rate hikes, systemic risks, cyber threats, and public debt. Empirical data demonstrate the resilience of U.S. banks, while highlighting areas requiring continuous monitoring and regulatory vigilance.' WHERE id = 'art_1780456399539_ceb6u';
UPDATE articles SET description = '' WHERE id = 'art_1780456604588_qhjse' AND description LIKE 'https://%';
-- 1e. display order per the brief (Core studies -> Supporting -> Methodology -> Comparative & crisis); unique values, no ties
UPDATE articles SET sort_order = 1 WHERE id = 'art_1778076568291';
UPDATE articles SET sort_order = 2 WHERE id = 'art_us_02';
UPDATE articles SET sort_order = 3 WHERE id = 'art_us_03';
UPDATE articles SET sort_order = 4 WHERE id = 'art_featured_01';
UPDATE articles SET sort_order = 5 WHERE id = 'art_1778077029349';
UPDATE articles SET sort_order = 6 WHERE id = 'art_1780456399539_ceb6u';
UPDATE articles SET sort_order = 7 WHERE id = 'art_1780454885593_8l7pe';
UPDATE articles SET sort_order = 8 WHERE id = 'art_1780456604588_qhjse';
UPDATE articles SET sort_order = 9 WHERE id = 'art_1780455693383_1e867';
UPDATE articles SET sort_order = 10 WHERE id = 'art_1778077504781';
UPDATE articles SET sort_order = 11 WHERE id = 'art_1783015302967_9z5at';
