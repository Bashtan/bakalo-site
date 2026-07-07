import { requireAuth } from '../lib/auth.js';

const VALID_PLATFORMS = ['google_scholar', 'ssrn', 'orcid', 'researchgate', 'linkedin'];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestGet({ env }) {
  let results;
  try {
    ({ results } = await env.DB.prepare(
      `SELECT platform, stat_key, stat_year, stat_value
       FROM profile_stats_history
       ORDER BY platform, stat_key, stat_year ASC`
    ).all());
  } catch {
    return json({ history: {} });
  }

  // Group: history[platform][stat_key] = [{ year, value }, ...]
  const history = {};
  for (const row of results) {
    if (!history[row.platform]) history[row.platform] = {};
    if (!history[row.platform][row.stat_key]) history[row.platform][row.stat_key] = [];
    history[row.platform][row.stat_key].push({ year: row.stat_year, value: row.stat_value });
  }
  return json({ history });
}

export async function onRequestPost({ request, env }) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { platform, stats, year } = body || {};
  if (!VALID_PLATFORMS.includes(platform)) return json({ error: 'invalid platform' }, 400);
  if (!stats || typeof stats !== 'object') return json({ error: 'stats object required' }, 400);

  const currentYear = new Date().getFullYear();
  const parsedYear  = Number(year);
  if (!Number.isInteger(parsedYear) || parsedYear < 2000 || parsedYear > currentYear) {
    return json({ error: `year must be an integer between 2000 and ${currentYear}` }, 400);
  }

  const saved_at = new Date().toISOString();
  for (const [stat_key, rawVal] of Object.entries(stats)) {
    const stat_value = String(typeof rawVal === 'object' ? (rawVal.value ?? '') : rawVal);
    if (!stat_value) continue;
    await env.DB.prepare(
      `INSERT OR REPLACE INTO profile_stats_history
         (platform, stat_key, stat_year, stat_value, saved_at)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(platform, stat_key, parsedYear, stat_value, saved_at).run();
  }
  return json({ ok: true });
}
