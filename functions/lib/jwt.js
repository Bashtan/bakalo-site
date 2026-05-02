const ALGO = { name: 'HMAC', hash: 'SHA-256' };
const enc = new TextEncoder();

function b64url(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function b64urlDecode(str) {
  return atob(str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - str.length % 4) % 4, '='));
}

async function importKey(secret) {
  return crypto.subtle.importKey('raw', enc.encode(secret), ALGO, false, ['sign', 'verify']);
}

export async function sign(payload, secret) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign(ALGO, key, enc.encode(data));
  const sigStr = String.fromCharCode(...new Uint8Array(sig));
  return `${data}.${b64url(sigStr)}`;
}

export async function verify(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');
  const [header, body, sig] = parts;
  const key = await importKey(secret);
  const sigBytes = Uint8Array.from(b64urlDecode(sig), c => c.charCodeAt(0));
  const valid = await crypto.subtle.verify(ALGO, key, sigBytes, enc.encode(`${header}.${body}`));
  if (!valid) throw new Error('Invalid signature');
  const payload = JSON.parse(b64urlDecode(body));
  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) throw new Error('Token expired');
  return payload;
}
