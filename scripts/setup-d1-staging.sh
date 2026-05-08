#!/usr/bin/env bash
# Run once to create D1 database, apply migrations, and seed staging data.
# Usage: bash scripts/setup-d1-staging.sh
set -e

DB_NAME="bakalo-db"
DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR"

echo "── Creating D1 database..."
CREATE_OUT=$(npx wrangler d1 create "$DB_NAME" 2>&1 || true)
if echo "$CREATE_OUT" | grep -q "already exists"; then
  echo "   Already exists — fetching id..."
  DB_ID=$(npx wrangler d1 list 2>&1 | grep "$DB_NAME" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
else
  DB_ID=$(echo "$CREATE_OUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
fi

echo "   database_id = $DB_ID"
sed -i.bak "s|database_id = \".*\"|database_id = \"$DB_ID\"|" wrangler.toml
echo "── wrangler.toml patched"

echo "── Applying migrations..."
npx wrangler d1 migrations apply "$DB_NAME" --remote

echo "── Seeding data..."
npx wrangler d1 execute "$DB_NAME" --remote --file=seed.sql

echo ""
echo "✅ D1 setup complete. database_id = $DB_ID"
echo ""
echo "Next steps in Cloudflare Dashboard → Pages → bakalo-capital → Settings → Environment Variables:"
echo "  Add for Preview environment: JWT_SECRET = <long random string>"
