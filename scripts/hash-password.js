#!/usr/bin/env node
// Usage: node scripts/hash-password.js <password>
// Prints a hash string to use in seed.sql or wrangler d1 execute

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.js <password>');
  process.exit(1);
}

const enc = new TextEncoder();

async function hashPassword(pw) {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const iterations = 100000;
  const key = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations },
    key, 256
  );
  const hash = Buffer.from(bits).toString('base64');
  return `pbkdf2:sha256:${iterations}:${salt}:${hash}`;
}

hashPassword(password).then(hash => {
  console.log('\nHash:');
  console.log(hash);
  console.log('\nSQL snippet:');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'YOUR_EMAIL';`);
});
