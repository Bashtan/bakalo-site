import { requireAuth } from '../../lib/auth.js';

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestGet({ env, params }) {
  const item = await env.DB.prepare('SELECT * FROM evidence WHERE id = ?').bind(params.id).first();
  if (!item) return json({ error: 'Not found' }, 404);
  return json(item);
}

export async function onRequestPut({ request, env, params }) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  const existing = await env.DB.prepare('SELECT * FROM evidence WHERE id = ?').bind(params.id).first();
  if (!existing) return json({ error: 'Not found' }, 404);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const updated = { ...existing };
  if (body.title !== undefined) updated.title = body.title;
  if (body.description !== undefined) updated.description = body.description;
  if (body.institution !== undefined) updated.institution = body.institution;
  if (body.year !== undefined) updated.year = body.year;
  if (body.evidence_url !== undefined) updated.evidence_url = body.evidence_url;
  if (body.sort_order !== undefined) updated.sort_order = body.sort_order;

  await env.DB.prepare(
    'UPDATE evidence SET title=?, description=?, institution=?, year=?, evidence_url=?, sort_order=? WHERE id=?'
  ).bind(updated.title, updated.description, updated.institution, updated.year, updated.evidence_url, updated.sort_order, params.id).run();

  const item = await env.DB.prepare('SELECT * FROM evidence WHERE id = ?').bind(params.id).first();
  return json(item);
}

export async function onRequestDelete({ request, env, params }) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  const existing = await env.DB.prepare('SELECT * FROM evidence WHERE id = ?').bind(params.id).first();
  if (!existing) return json({ error: 'Not found' }, 404);

  await env.DB.prepare('DELETE FROM evidence WHERE id = ?').bind(params.id).run();
  return new Response(null, { status: 204 });
}
