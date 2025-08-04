-- Add media and social link fields for company submissions
ALTER TABLE company_submissions
  ADD COLUMN logo_url text,
  ADD COLUMN product_image_url text,
  ADD COLUMN linkedin text,
  ADD COLUMN twitter text,
  ADD COLUMN facebook text;
