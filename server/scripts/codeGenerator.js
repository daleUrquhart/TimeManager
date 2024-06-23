const crypto = require('crypto');

const key = crypto.randomBytes(32).toString('hex');
const iv = crypto.randomBytes(16).toString('hex');

console.log('ENCRYPTION_KEY=', key);
console.log('ENCRYPTION_IV=', iv);
