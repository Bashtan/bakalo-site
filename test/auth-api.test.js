import { describe, test, expect, beforeAll, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { createD1Mock } from './helpers/d1.js';
import { hashPassword } from '../functions/lib/password.js';
import { onRequestPost } from '../functions/api/auth.js';

const SCHEMA = readFileSync('./migrations/0001_init.sql', 'utf8');
const SECRET = 'test-jwt-secret-at-least-32-chars!';
const TEST_EMAIL = 'admin@test.com';
const TEST_PASSWORD = 'correct-horse-battery';

let adminHash;
let db, env;

beforeAll(async () => {
  adminHash = await hashPassword(TEST_PASSWORD);
});

beforeEach(async () => {
  db = createD1Mock(SCHEMA);
  env = { DB: db, JWT_SECRET: SECRET };
  await db.prepare(
    'INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind('u1', TEST_EMAIL, adminHash, 'admin', new Date().toISOString()).run();
});

const req = body => new Request('https://example.com/api/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

describe('POST /api/auth', () => {
  test('valid credentials → 200 + JWT token', async () => {
    const res = await onRequestPost({ request: req({ email: TEST_EMAIL, password: TEST_PASSWORD }), env });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(typeof body.token).toBe('string');
    expect(body.token.split('.').length).toBe(3);
  });

  test('wrong password → 401', async () => {
    const res = await onRequestPost({ request: req({ email: TEST_EMAIL, password: 'wrong' }), env });
    expect(res.status).toBe(401);
  });

  test('unknown email → 401', async () => {
    const res = await onRequestPost({ request: req({ email: 'nobody@test.com', password: TEST_PASSWORD }), env });
    expect(res.status).toBe(401);
  });

  test('missing password → 400', async () => {
    const res = await onRequestPost({ request: req({ email: TEST_EMAIL }), env });
    expect(res.status).toBe(400);
  });

  test('missing email → 400', async () => {
    const res = await onRequestPost({ request: req({ password: TEST_PASSWORD }), env });
    expect(res.status).toBe(400);
  });

  test('returned JWT contains correct role', async () => {
    const res = await onRequestPost({ request: req({ email: TEST_EMAIL, password: TEST_PASSWORD }), env });
    const { token } = await res.json();
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    expect(payload.role).toBe('admin');
    expect(payload.email).toBe(TEST_EMAIL);
  });
});
