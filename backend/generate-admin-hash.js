// Օգնական script՝ admin password-ի bcrypt hash generate անելու համար
//
// Օգտագործում.
//   node generate-admin-hash.js "ձեր_ուզած_գաղտնաբառը"
//
// Ստացված hash-ը դրու .env ֆայլում (և Render-ի Environment Variables-ում)՝
//   ADMIN_PASSWORD_HASH=<ստացված hash-ը>
//
// Հին ADMIN_PASSWORD (plaintext) փոփոխականը կարող ես ամբողջությամբ ջնջել,
// այն այլևս չի օգտագործվում server.js-ում։

import bcrypt from 'bcrypt';

const plainPassword = process.argv[2];

if (!plainPassword) {
          console.error('Օգտագործում. node generate-admin-hash.js "ձեր_գաղտնաբառը"');
          process.exit(1);
}

const hash = await bcrypt.hash(plainPassword, 10);
console.log('\nԱվելացրու .env ֆայլում (և Render-ի Environment Variables-ում)՝\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);