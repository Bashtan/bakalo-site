import { requireAuth } from '../lib/auth.js';

const VALID_PLATFORMS = ['google_scholar', 'ssrn', 'orcid', 'researchgate', 'linkedin'];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestGet({ env }) {
  let results;
  try {
    ({ results } = await env.DB.prepare(
      'SELECT platform, stat_key, stat_value, trend_pct, updated_at FROM profile_stats'
    ).all());
  } catch {
    return json({ stats: {} });
  }

  const stats = {};
  for (const row of results) {
    if (!stats[row.platform]) stats[row.platform] = {};
    stats[row.platform][row.stat_key] = {
      value: row.stat_value,
      trend_pct: row.trend_pct ?? '',
      updated_at: row.updated_at
    };
  }
  return json({ stats });
}

export async function onRequestPut({ request, env }) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { platform, stats } = body || {};
  if (!VALID_PLATFORMS.includes(platform)) return json({ error: 'invalid platform' }, 400);
  if (!stats || typeof stats !== 'object') return json({ error: 'stats object required' }, 400);

  const updated_at = new Date().toISOString();
  const stat_year  = new Date().getFullYear();

  for (const [stat_key, rawVal] of Object.entries(stats)) {
    // Accept both plain string ("37") and object ({ value: "37", trend_pct: "18" })
    const stat_value = typeof rawVal === 'object' ? String(rawVal.value ?? '') : String(rawVal);
    const trend_pct  = typeof rawVal === 'object' ? String(rawVal.trend_pct ?? '') : '';

    await env.DB.prepare(
      `INSERT INTO profile_stats (platform, stat_key, stat_value, trend_pct, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(platform, stat_key) DO UPDATE SET
         stat_value = excluded.stat_value,
         trend_pct  = excluded.trend_pct,
         updated_at = excluded.updated_at`
    ).bind(platform, stat_key, stat_value, trend_pct, updated_at).run();

    // Auto-snapshot into history (one row per platform+key+year; replace on re-save)
    await env.DB.prepare(
      `INSERT OR REPLACE INTO profile_stats_history
         (platform, stat_key, stat_year, stat_value, saved_at)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(platform, stat_key, stat_year, stat_value, updated_at).run();
  }
  return json({ ok: true });
}
