import { describe, test, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { recognition } = JSON.parse(readFileSync(join(root, 'research-impact.json'), 'utf8'));

describe('research-impact.json › recognition', () => {
  test('every entry has a unique id, a title and a subtitle', () => {
    const ids = recognition.map(r => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of recognition) {
      expect(r.id, 'id').toBeTruthy();
      expect(r.title, `${r.id} title`).toBeTruthy();
      expect(r.subtitle, `${r.id} subtitle`).toBeTruthy();
    }
  });

  test('at most one entry is featured', () => {
    expect(recognition.filter(r => r.featured).length).toBeLessThanOrEqual(1);
  });

  test('document links point to real PDFs that ship in assets/documents/', () => {
    const docs = recognition.flatMap(r => (r.documents || []).map(d => ({ id: r.id, ...d })));
    for (const d of docs) {
      expect(d.label, `${d.id} label`).toBeTruthy();
      expect(d.url, `${d.id} url`).toMatch(/^\/assets\/documents\/[\w.-]+\.pdf$/);
      const file = join(root, d.url);
      expect(existsSync(file), `${d.url} exists in the repo`).toBe(true);
      expect(readFileSync(file).subarray(0, 5).toString(), `${d.url} is a PDF`).toBe('%PDF-');
    }
  });

  test('external links use https', () => {
    const links = recognition.flatMap(r => [r.url, r.subtitleUrl]).filter(u => u && !u.startsWith('/'));
    for (const u of links) expect(u).toMatch(/^https:\/\//);
  });
});
