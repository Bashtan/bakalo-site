import { describe, test, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { createD1Mock } from './helpers/d1.js';
import { sign } from '../functions/lib/jwt.js';
import { onRequestGet, onRequestPut } from '../functions/api/profile-stats.js';

const SCHEMA = readFileSync('./migrations/0001_init.sql', 'utf8')
             + readFileSync('./migrations/0002_evidence_engagements.sql', 'utf8')
             + readFileSync('./migrations/0003_category_tabs.sql', 'utf8')
             + readFileSync('./migrations/0004_profile_stats.sql', 'utf8');
const SECRET = 'test-jwt-secret-at-least-32-chars!';

let db, env, adminToken;

beforeEach(async () => {
  db = createD1Mock(SCHEMA);
  env = { DB: db, JWT_SECRET: SECRET };
  const exp = Math.floor(Date.now() / 1000) + 3600;
  adminToken = await sign({ userId: 'u1', email: 'admin@test.com', role: 'admin', exp }, SECRET);
});

const req = (method, body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return new Request('https://example.com/api/profile-stats', {
    method, headers, body: body ? JSON.stringify(body) : null
  });
};

describe('GET /api/profile-stats', () => {
  test('returns 200 with empty stats on fresh DB', async () => {
    const res = await onRequestGet({ env });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ stats: {} });
  });

  test('returns stats grouped by platform after insert', async () => {
    await onRequestPut({
      request: req('PUT', {
        platform: 'google_scholar',
        stats: { citations_all: '37', h_index: '3' }
      }, adminToken),
      env
    });
    const body = await (await onRequestGet({ env })).json();
    expect(body.stats.google_scholar.citations_all.value).toBe('37');
    expect(body.stats.google_scholar.h_index.value).toBe('3');
    expect(body.stats.google_scholar.citations_all.updated_at).toMatch(/^\d{4}-/);
  });

  test('multiple platforms are each in their own key', async () => {
    await onRequestPut({ request: req('PUT', { platform: 'google_scholar', stats: { citations_all: '37' } }, adminToken), env });
    await onRequestPut({ request: req('PUT', { platform: 'orcid', stats: { works_count: '12' } }, adminToken), env });
    const body = await (await onRequestGet({ env })).json();
    expect(Object.keys(body.stats)).toEqual(expect.arrayContaining(['google_scholar', 'orcid']));
    expect(body.stats.orcid.works_count.value).toBe('12');
  });
});

describe('PUT /api/profile-stats', () => {
  test('no token → 401', async () => {
    const res = await onRequestPut({ request: req('PUT', { platform: 'orcid', stats: { works_count: '5' } }), env });
    expect(res.status).toBe(401);
  });

  test('unknown platform → 400', async () => {
    const res = await onRequestPut({
      request: req('PUT', { platform: 'fake_platform', stats: { foo: 'bar' } }, adminToken),
      env
    });
    expect(res.status).toBe(400);
  });

  test('valid body upserts stats', async () => {
    const res = await onRequestPut({
      request: req('PUT', { platform: 'ssrn', stats: { total_downloads: '1234', papers_count: '7' } }, adminToken),
      env
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  test('subsequent PUT overwrites previous value', async () => {
    await onRequestPut({ request: req('PUT', { platform: 'orcid', stats: { works_count: '10' } }, adminToken), env });
    await onRequestPut({ request: req('PUT', { platform: 'orcid', stats: { works_count: '15' } }, adminToken), env });
    const body = await (await onRequestGet({ env })).json();
    expect(body.stats.orcid.works_count.value).toBe('15');
  });
});
