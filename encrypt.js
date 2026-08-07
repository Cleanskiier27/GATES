const { Buffer } = require('node:buffer');

function encryptToBase64(text) {
  return Buffer.from(text, 'utf8').toString('base64');
}

function printUsage() {
  console.log('Usage: npm run encrypt -- "<text>"');
}

const input = process.argv[2];

if (!input) {
  printUsage();
  process.exit(1);
}

try {
  const encrypted = encryptToBase64(input);
  console.log(encrypted);
} catch (error) {
  console.error('Failed to encrypt text.');
  process.exit(1);
}
