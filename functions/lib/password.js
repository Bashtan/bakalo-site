const enc = new TextEncoder();

export async function hashPassword(password, iterations = 100000) {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations },
    key, 256
  );
  const hash = btoa(String.fromCharCode(...new Uint8Array(bits)));
  return `pbkdf2:sha256:${iterations}:${salt}:${hash}`;
}

export async function verifyPassword(password, stored) {
  const parts = stored.split(':');
  if (parts.length !== 5 || parts[0] !== 'pbkdf2') return false;
  const [, , iters, salt, hash] = parts;
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: parseInt(iters) },
    key, 256
  );
  const derived = btoa(String.fromCharCode(...new Uint8Array(bits)));
  return derived === hash;
}
