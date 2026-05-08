import { requireAuth } from '../../lib/auth.js';

const VALID_CATEGORIES = [
  'U.S. Banking System',
  'Financial Stability',
  'Risk & Regulation',
  'Research & Methodology'
];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestGet({ env, params }) {
  const article = await env.DB.prepare('SELECT * FROM articles WHERE id = ?').bind(params.id).first();
  if (!article) return json({ error: 'Not found' }, 404);
  return json(article);
}

export async function onRequestPut({ request, env, params }) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  const existing = await env.DB.prepare('SELECT * FROM articles WHERE id = ?').bind(params.id).first();
  if (!existing) return json({ error: 'Not found' }, 404);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const updated = { ...existing };
  if (body.title !== undefined) updated.title = body.title;
  if (body.url !== undefined) updated.url = body.url;
  if (body.category !== undefined) {
    if (!VALID_CATEGORIES.includes(body.category)) return json({ error: 'invalid category' }, 400);
    updated.category = body.category;
  }
  if (body.description !== undefined) updated.description = body.description;
  if (body.year !== undefined) updated.year = body.year;
  if (body.is_featured !== undefined) updated.is_featured = body.is_featured ? 1 : 0;
  if (body.sort_order !== undefined) updated.sort_order = body.sort_order;
  if (body.ssrn_url !== undefined) updated.ssrn_url = body.ssrn_url;
  if (body.doi_url !== undefined) updated.doi_url = body.doi_url;
  if (body.tags !== undefined) updated.tags = body.tags;

  await env.DB.prepare(
    'UPDATE articles SET title=?, url=?, category=?, description=?, year=?, is_featured=?, sort_order=?, ssrn_url=?, doi_url=?, tags=? WHERE id=?'
  ).bind(updated.title, updated.url, updated.category, updated.description, updated.year, updated.is_featured, updated.sort_order, updated.ssrn_url ?? '', updated.doi_url ?? '', updated.tags ?? '', params.id).run();

  const article = await env.DB.prepare('SELECT * FROM articles WHERE id = ?').bind(params.id).first();
  return json(article);
}

export async function onRequestDelete({ request, env, params }) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  const existing = await env.DB.prepare('SELECT * FROM articles WHERE id = ?').bind(params.id).first();
  if (!existing) return json({ error: 'Not found' }, 404);

  await env.DB.prepare('DELETE FROM articles WHERE id = ?').bind(params.id).run();
  return new Response(null, { status: 204 });
}
