import { describe, test, expect } from 'vitest';
import { sign, verify } from '../functions/lib/jwt.js';

const SECRET = 'test-secret-key-at-least-32-chars!!';

describe('JWT', () => {
  test('sign → verify returns correct payload', async () => {
    const payload = { userId: '1', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 };
    const token = await sign(payload, SECRET);
    const decoded = await verify(token, SECRET);
    expect(decoded.userId).toBe('1');
    expect(decoded.role).toBe('admin');
  });

  test('expired token throws "Token expired"', async () => {
    const payload = { userId: '1', exp: Math.floor(Date.now() / 1000) - 1 };
    const token = await sign(payload, SECRET);
    await expect(verify(token, SECRET)).rejects.toThrow('Token expired');
  });

  test('tampered signature throws', async () => {
    const payload = { userId: '1', exp: Math.floor(Date.now() / 1000) + 3600 };
    const token = await sign(payload, SECRET);
    const [h, b] = token.split('.');
    await expect(verify(`${h}.${b}.invalidsignature`, SECRET)).rejects.toThrow();
  });

  test('token with no exp does not throw', async () => {
    const token = await sign({ userId: '1', role: 'admin' }, SECRET);
    const decoded = await verify(token, SECRET);
    expect(decoded.userId).toBe('1');
  });
});
