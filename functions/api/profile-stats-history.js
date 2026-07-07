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
