import { verify } from './jwt.js';

const json = (data, status) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export async function requireAuth(request, env, requiredRole = 'admin') {
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401);
  const token = authHeader.slice(7);
  let payload;
  try {
    payload = await verify(token, env.JWT_SECRET);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }
  if (requiredRole === 'admin' && payload.role !== 'admin') return json({ error: 'Forbidden' }, 403);
  return payload;
}
