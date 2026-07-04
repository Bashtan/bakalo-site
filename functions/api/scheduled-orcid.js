import { parseWorksCount } from '../lib/orcid.js';

const ORCID_ID = '0009-0007-5773-1436';

export default {
  async scheduled(_event, env) {
    let count;
    try {
      const res = await fetch(`https://pub.orcid.org/v3.0/${ORCID_ID}/works`, {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) return;
      count = parseWorksCount(await res.json());
    } catch {
      return;
    }

    const updated_at = new Date().toISOString();
    await env.DB.prepare(
      'INSERT INTO profile_stats (platform, stat_key, stat_value, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(platform, stat_key) DO UPDATE SET stat_value = excluded.stat_value, updated_at = excluded.updated_at'
    ).bind('orcid', 'works_count', String(count), updated_at).run();
  }
};
