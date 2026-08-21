/**
 * Usage: npm run hash -- "yourNewPassword"
 * Prints a bcrypt hash to paste into ADMIN_PASSWORD_HASH in .env.local / Vercel.
 */
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.error('Usage: npm run hash -- "yourPassword"');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log('\nAdd this to ADMIN_PASSWORD_HASH:\n');
  console.log(hash);
  console.log('');
});
