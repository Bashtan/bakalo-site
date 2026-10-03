-- TIER 3 (optional): canonical https://doi.org/ form for DOI links (dx.doi.org and http:// still work, just inconsistent)
UPDATE articles SET doi_url = 'https://doi.org/10.2139/ssrn.6663479' WHERE id = 'art_featured_01';
UPDATE articles SET doi_url = 'https://doi.org/10.2139/ssrn.6507859' WHERE id = 'art_us_02';
UPDATE articles SET doi_url = 'https://doi.org/10.2139/ssrn.6352319' WHERE id = 'art_us_03';
UPDATE articles SET doi_url = 'https://doi.org/10.2139/ssrn.6709439' WHERE id = 'art_1778077029349';
UPDATE articles SET doi_url = 'https://doi.org/10.2139/ssrn.6720603' WHERE id = 'art_1780454487617_doj8g';
UPDATE articles SET doi_url = 'https://doi.org/10.32750/2025-0450' WHERE id = 'art_1780454885593_8l7pe';
UPDATE articles SET doi_url = 'https://doi.org/10.51586/2025_12_38' WHERE id = 'art_1780455693383_1e867';
