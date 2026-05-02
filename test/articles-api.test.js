import { describe, test, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { createD1Mock } from './helpers/d1.js';
import { sign } from '../functions/lib/jwt.js';
import { onRequestGet, onRequestPost } from '../functions/api/articles.js';
import { onRequestGet as onRequestGetOne, onRequestPut, onRequestDelete } from '../functions/api/articles/[id].js';

const SCHEMA = readFileSync('./migrations/0001_init.sql', 'utf8');
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
  title: 'Test Article',
  url: 'https://example.com/paper',
  category: 'U.S. Banking System',
  description: 'A test paper.',
  year: 2024
};

const req = (method, body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return new Request('https://example.com/api/articles', {
    method, headers, body: body ? JSON.stringify(body) : null
  });
};

describe('GET /api/articles', () => {
  test('returns empty array when no articles', async () => {
    const res = await onRequestGet({ env });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  test('featured article sorts first', async () => {
    await onRequestPost({ request: req('POST', VALID, adminToken), env });
    await onRequestPost({ request: req('POST', { ...VALID, title: 'Featured Paper', is_featured: 1 }, adminToken), env });
    const articles = await (await onRequestGet({ env })).json();
    expect(articles[0].title).toBe('Featured Paper');
    expect(articles[0].is_featured).toBe(1);
  });
});

describe('POST /api/articles', () => {
  test('no token → 401', async () => {
    const res = await onRequestPost({ request: req('POST', VALID), env });
    expect(res.status).toBe(401);
  });

  test('reviewer token → 403', async () => {
    const res = await onRequestPost({ request: req('POST', VALID, reviewerToken), env });
    expect(res.status).toBe(403);
  });

  test('valid admin token → 201 with article', async () => {
    const res = await onRequestPost({ request: req('POST', VALID, adminToken), env });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBeTruthy();
    expect(body.title).toBe('Test Article');
    expect(body.category).toBe('U.S. Banking System');
  });

  test('unknown category → 400', async () => {
    const res = await onRequestPost({ request: req('POST', { ...VALID, category: 'Fake' }, adminToken), env });
    expect(res.status).toBe(400);
  });

  test('missing title → 400', async () => {
    const { title: _, ...noTitle } = VALID;
    const res = await onRequestPost({ request: req('POST', noTitle, adminToken), env });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/articles/:id', () => {
  test('updates sort_order', async () => {
    const { id } = await (await onRequestPost({ request: req('POST', VALID, adminToken), env })).json();
    const res = await onRequestPut({ request: req('PUT', { sort_order: 5 }, adminToken), env, params: { id } });
    expect(res.status).toBe(200);
    expect((await res.json()).sort_order).toBe(5);
  });

  test('no token → 401', async () => {
    const { id } = await (await onRequestPost({ request: req('POST', VALID, adminToken), env })).json();
    const res = await onRequestPut({ request: req('PUT', { sort_order: 5 }), env, params: { id } });
    expect(res.status).toBe(401);
  });

  test('unknown id → 404', async () => {
    const res = await onRequestPut({ request: req('PUT', { title: 'x' }, adminToken), env, params: { id: 'nonexistent' } });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/articles/:id', () => {
  test('deletes article → 204, absent from GET', async () => {
    const { id } = await (await onRequestPost({ request: req('POST', VALID, adminToken), env })).json();
    const delRes = await onRequestDelete({ request: req('DELETE', null, adminToken), env, params: { id } });
    expect(delRes.status).toBe(204);
    const articles = await (await onRequestGet({ env })).json();
    expect(articles.find(a => a.id === id)).toBeUndefined();
  });

  test('no token → 401', async () => {
    const { id } = await (await onRequestPost({ request: req('POST', VALID, adminToken), env })).json();
    const res = await onRequestDelete({ request: req('DELETE'), env, params: { id } });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/articles/:id', () => {
  test('returns article by id', async () => {
    const { id } = await (await onRequestPost({ request: req('POST', VALID, adminToken), env })).json();
    const res = await onRequestGetOne({ env, params: { id } });
    expect(res.status).toBe(200);
    expect((await res.json()).title).toBe('Test Article');
  });

  test('unknown id → 404', async () => {
    const res = await onRequestGetOne({ env, params: { id: 'nope' } });
    expect(res.status).toBe(404);
  });
});
