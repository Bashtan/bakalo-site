import { describe, test, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { createD1Mock } from './helpers/d1.js';
import { sign } from '../functions/lib/jwt.js';
import { onRequestPut } from '../functions/api/profile-stats.js';
import { onRequestGet as onRequestGetHistory } from '../functions/api/profile-stats-history.js';

const SCHEMA = readFileSync('./migrations/0001_init.sql', 'utf8')
             + readFileSync('./migrations/0002_evidence_engagements.sql', 'utf8')
             + readFileSync('./migrations/0003_category_tabs.sql', 'utf8')
             + readFileSync('./migrations/0004_profile_stats.sql', 'utf8')
             + readFileSync('./migrations/0005_research_impact.sql', 'utf8');
const SECRET = 'test-jwt-secret-at-least-32-chars!';

let db, env, adminToken;

beforeEach(async () => {
  db = createD1Mock(SCHEMA);
  env = { DB: db, JWT_SECRET: SECRET };
  const exp = Math.floor(Date.now() / 1000) + 3600;
  adminToken = await sign({ userId: 'u1', email: 'admin@test.com', role: 'admin', exp }, SECRET);
});

const req = (body, token) => new Request('https://example.com/api/profile-stats', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify(body)
});

describe('GET /api/profile-stats-history', () => {
  test('returns 200 with empty history on fresh DB', async () => {
    const res = await onRequestGetHistory({ env });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ history: {} });
  });

  test('returns grouped history after a PUT to profile-stats', async () => {
    await onRequestPut({ request: req({ platform: 'google_scholar', stats: { citations_all: '37' } }, adminToken), env });
    const body = await (await onRequestGetHistory({ env })).json();
    expect(body.history.google_scholar.citations_all).toHaveLength(1);
    expect(body.history.google_scholar.citations_all[0].value).toBe('37');
    expect(body.history.google_scholar.citations_all[0].year).toBe(new Date().getFullYear());
  });

  test('saving the same stat twice in the same year replaces, not duplicates', async () => {
    await onRequestPut({ request: req({ platform: 'ssrn', stats: { total_downloads: '100' } }, adminToken), env });
    await onRequestPut({ request: req({ platform: 'ssrn', stats: { total_downloads: '200' } }, adminToken), env });
    const body = await (await onRequestGetHistory({ env })).json();
    const series = body.history.ssrn.total_downloads;
    expect(series).toHaveLength(1);
    expect(series[0].value).toBe('200');
  });

  test('multiple platforms appear under their own keys', async () => {
    await onRequestPut({ request: req({ platform: 'google_scholar', stats: { citations_all: '37' } }, adminToken), env });
    await onRequestPut({ request: req({ platform: 'researchgate',   stats: { reads: '500' } }, adminToken), env });
    const body = await (await onRequestGetHistory({ env })).json();
    expect(body.history.google_scholar.citations_all).toHaveLength(1);
    expect(body.history.researchgate.reads).toHaveLength(1);
    expect(body.history.researchgate.reads[0].value).toBe('500');
  });

  test('object-valued stat (with trend_pct) is snapshotted with the numeric value only', async () => {
    await onRequestPut({
      request: req({ platform: 'ssrn', stats: { total_downloads: { value: '888', trend_pct: '24' } } }, adminToken),
      env
    });
    const body = await (await onRequestGetHistory({ env })).json();
    expect(body.history.ssrn.total_downloads[0].value).toBe('888');
  });
});
