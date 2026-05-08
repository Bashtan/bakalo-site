import { requireAuth } from '../lib/auth.js';

const VALID_CATEGORIES = [
  'U.S. Banking System',
  'Financial Stability',
  'Risk & Regulation',
  'Research & Methodology'
];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM articles ORDER BY is_featured DESC, sort_order ASC, created_at ASC'
  ).all();
  return json(results);
}

export async function onRequestPost({ request, env }) {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { title, url, category, description = '', year, is_featured = 0, sort_order = 0,
          ssrn_url = '', doi_url = '', tags = '' } = body || {};
  if (!title) return json({ error: 'title required' }, 400);
  if (!url) return json({ error: 'url required' }, 400);
  if (!VALID_CATEGORIES.includes(category)) return json({ error: 'invalid category' }, 400);

  const id = 'art_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  const created_at = new Date().toISOString();

  await env.DB.prepare(
    'INSERT INTO articles (id, title, url, category, description, year, is_featured, sort_order, ssrn_url, doi_url, tags, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, title, url, category, description, year ?? null, is_featured ? 1 : 0, sort_order, ssrn_url, doi_url, tags, created_at).run();

  const article = await env.DB.prepare('SELECT * FROM articles WHERE id = ?').bind(id).first();
  return json(article, 201);
}
