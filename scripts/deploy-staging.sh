#!/usr/bin/env bash
set -e

PROJECT="bakalo-capital"
DB_NAME="bakalo-db"
BRANCH="feature/stakeholders-requirements"
DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Bakalo staging deploy ==="
echo "Project : $PROJECT"
echo "Branch  : $BRANCH"
echo "Dir     : $DIR"
echo ""

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "❌ CLOUDFLARE_API_TOKEN is not set. Run: export CLOUDFLARE_API_TOKEN=your_token"
  exit 1
fi

cd "$DIR"

# ── 1. Create or reuse D1 database ───────────────────────────────────────────
echo "── Step 1: D1 database"
CREATE_OUT=$(npx wrangler d1 create "$DB_NAME" 2>&1 || true)
if echo "$CREATE_OUT" | grep -q "already exists"; then
  echo "   DB already exists — fetching id..."
  DB_ID=$(npx wrangler d1 list 2>&1 | grep "$DB_NAME" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
else
  DB_ID=$(echo "$CREATE_OUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
fi

if [ -z "$DB_ID" ]; then
  echo "❌ Could not determine database_id. Output was:"
  echo "$CREATE_OUT"
  exit 1
fi
echo "   database_id = $DB_ID"

# ── 2. Patch wrangler.toml ────────────────────────────────────────────────────
echo "── Step 2: Patch wrangler.toml"
sed -i.bak "s|database_id = \".*\"|database_id = \"$DB_ID\"|" wrangler.toml
echo "   wrangler.toml updated"

# ── 3. Apply migrations ───────────────────────────────────────────────────────
echo "── Step 3: Apply migrations"
npx wrangler d1 migrations apply "$DB_NAME" --remote 2>&1
echo "   Migrations applied"

# ── 4. Seed data ──────────────────────────────────────────────────────────────
echo "── Step 4: Seed articles + admin user"
npx wrangler d1 execute "$DB_NAME" --remote --file=seed.sql 2>&1
echo "   Seed complete"

# ── 5. Deploy to Cloudflare Pages ─────────────────────────────────────────────
echo "── Step 5: Deploy to Pages (branch: $BRANCH)"
npx wrangler pages deploy . \
  --project-name "$PROJECT" \
  --branch "$BRANCH" \
  --commit-message "feat: stakeholder requirements — articles redesign + D1 + auth" \
  2>&1

echo ""
echo "✅ Staging deploy complete"
echo "   Preview URL will appear above (^)"
echo ""
echo "⚠️  BEFORE TESTING: set JWT_SECRET in Cloudflare Pages dashboard"
echo "   Pages → $PROJECT → Settings → Environment Variables → Preview"
echo "   Variable: JWT_SECRET = <any long random string>"
