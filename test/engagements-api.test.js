import { describe, test, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { createD1Mock } from './helpers/d1.js';
import { sign } from '../functions/lib/jwt.js';
import { onRequestGet, onRequestPost } from '../functions/api/engagements.js';
import { onRequestGet as onRequestGetOne, onRequestPut, onRequestDelete } from '../functions/api/engagements/[id].js';

const SCHEMA = readFileSync('./migrations/0001_init.sql', 'utf8')
             + readFileSync('./migrations/0002_evidence_engagements.sql', 'utf8')
             + readFileSync('./migrations/0003_category_tabs.sql', 'utf8');
const SECRET = 'test-jwt-secret-at-least-32-chars!';

let db, env, adminToken, reviewerToken;

beforeEach(async () => {
  db = createD1Mock(SCHEMA);
  env = { DB: db, JWT_SECRET: SECRET };
  const exp = Math.floor(Date.now() / 1000) + 3600;
  adminToken = await sign({ userId: 'u1', email: 'admin@test.com', role: 'admin', exp }, SECRET);
  reviewerToken = await sign({ userId: 'u2', email: 'reviewer@test.com', role: 'reviewer', exp }, SECRET);
});

const VALID = {
  title: 'Gartner Security & Risk Management Summit',
  description: 'Webinar on AI governance and systemic risk frameworks.',
  organization: 'Gartner',
  year: 2025,
  evidence_url: 'https://example.com/gartner-cert.pdf'
};

const req = (method, body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return new Request('https://example.com/api/engagements', {
    method, headers, body: body ? JSON.stringify(body) : null
  });
};

describe('GET /api/engagements', () => {
  test('returns empty array when no engagements', async () => {
    const res = await onRequestGet({ env });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });
});

describe('POST /api/engagements', () => {
  test('no token → 401', async () => {
    const res = await onRequestPost({ request: req('POST', VALID), env });
    expect(res.status).toBe(401);
  });

  test('reviewer token → 403', async () => {
    const res = await onRequestPost({ request: req('POST', VALID, reviewerToken), env });
    expect(res.status).toBe(403);
  });

  test('valid admin token → 201 with engagement', async () => {
    const res = await onRequestPost({ request: req('POST', VALID, adminToken), env });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBeTruthy();
    expect(body.title).toBe('Gartner Security & Risk Management Summit');
    expect(body.organization).toBe('Gartner');
    expect(body.year).toBe(2025);
  });

  test('missing title → 400', async () => {
    const { title: _, ...noTitle } = VALID;
    const res = await onRequestPost({ request: req('POST', noTitle, adminToken), env });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/engagements/:id', () => {
  test('returns item by id', async () => {
    const { id } = await (await onRequestPost({ request: req('POST', VALID, adminToken), env })).json();
    const res = await onRequestGetOne({ env, params: { id } });
    expect(res.status).toBe(200);
    expect((await res.json()).title).toBe('Gartner Security & Risk Management Summit');
  });

  test('unknown id → 404', async () => {
    const res = await onRequestGetOne({ env, params: { id: 'nope' } });
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/engagements/:id', () => {
  test('updates sort_order', async () => {
    const { id } = await (await onRequestPost({ request: req('POST', VALID, adminToken), env })).json();
    const res = await onRequestPut({ request: req('PUT', { sort_order: 2 }, adminToken), env, params: { id } });
    expect(res.status).toBe(200);
    expect((await res.json()).sort_order).toBe(2);
  });

  test('no token → 401', async () => {
    const { id } = await (await onRequestPost({ request: req('POST', VALID, adminToken), env })).json();
    const res = await onRequestPut({ request: req('PUT', { sort_order: 1 }), env, params: { id } });
    expect(res.status).toBe(401);
  });

  test('unknown id → 404', async () => {
    const res = await onRequestPut({ request: req('PUT', { title: 'x' }, adminToken), env, params: { id: 'nonexistent' } });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/engagements/:id', () => {
  test('deletes item → 204, absent from GET', async () => {
    const { id } = await (await onRequestPost({ request: req('POST', VALID, adminToken), env })).json();
    const delRes = await onRequestDelete({ request: req('DELETE', null, adminToken), env, params: { id } });
    expect(delRes.status).toBe(204);
    const items = await (await onRequestGet({ env })).json();
    expect(items.find(e => e.id === id)).toBeUndefined();
  });

  test('no token → 401', async () => {
    const { id } = await (await onRequestPost({ request: req('POST', VALID, adminToken), env })).json();
    const res = await onRequestDelete({ request: req('DELETE'), env, params: { id } });
    expect(res.status).toBe(401);
  });
});
