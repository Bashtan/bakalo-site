import { sign } from '../lib/jwt.js';
import { verifyPassword } from '../lib/password.js';

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { email, password } = body || {};
  if (!email || !password) return json({ error: 'email and password required' }, 400);

  const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  if (!user) return json({ error: 'Invalid credentials' }, 401);

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return json({ error: 'Invalid credentials' }, 401);

  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  const token = await sign({ userId: user.id, email: user.email, role: user.role, exp }, env.JWT_SECRET);

  return json({ token });
}
