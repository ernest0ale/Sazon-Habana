/**
 * ============================================
 * HASH-PASSWORDS.JS
 * ============================================
 * Genera hashes bcrypt para el seed de Supabase.
 *
 * Uso:
 *   node scripts/hash-passwords.js
 *   node scripts/hash-passwords.js "MiPassword123!"
 */

import bcrypt from 'bcryptjs';

const DEFAULT_PASSWORDS = [
  { name: 'admin@sazonhabana.com', password: 'Admin123!' },
  { name: 'gestor@elbiky.com', password: 'Biky123!' }
];

async function hashAll() {
  const args = process.argv.slice(2);

  if (args.length === 1) {
    const hash = await bcrypt.hash(args[0], 12);
    console.log(`\nPassword: ${args[0]}\nHash:     ${hash}\n`);
    return;
  }

  console.log('\n🔐 Generando hashes bcrypt (cost 12)...\n');

  for (const { name, password } of DEFAULT_PASSWORDS) {
    const hash = await bcrypt.hash(password, 12);
    console.log(`📧 ${name}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`🔒 Hash:     ${hash}\n`);
  }

  console.log('Copia estos hashes a supabase/06_seed.sql\n');
}

hashAll().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});