-- Add category column for filter tabs on Implementation & Recognition and Professional Engagement sections
ALTER TABLE evidence    ADD COLUMN category TEXT NOT NULL DEFAULT '';
ALTER TABLE engagements ADD COLUMN category TEXT NOT NULL DEFAULT '';
