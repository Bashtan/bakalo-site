import { requireAuth } from '../lib/auth.js';

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM evidence ORDER BY sort_order ASC, created_at ASC'
  ).all();
  return json(results);
}

export async function onRequestPost({ request, env }) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { title, description = '', institution = '', year = null, evidence_url = '', sort_order = 0 } = body || {};
  if (!title) return json({ error: 'title required' }, 400);

  const id = 'ev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  const created_at = new Date().toISOString();

  await env.DB.prepare(
    'INSERT INTO evidence (id, title, description, institution, year, evidence_url, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, title, description, institution, year, evidence_url, sort_order, created_at).run();

  const item = await env.DB.prepare('SELECT * FROM evidence WHERE id = ?').bind(id).first();
  return json(item, 201);
}
