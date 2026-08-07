const { Buffer } = require('node:buffer');

function decryptBase64(encodedText) {
  return Buffer.from(encodedText, 'base64').toString('utf8');
}

function printUsage() {
  console.log('Usage: npm run decrypt -- "<base64-text>"');
}

const input = process.argv[2];

if (!input) {
  printUsage();
  process.exit(1);
}

try {
  const decrypted = decryptBase64(input);
  console.log(decrypted);
} catch (error) {
  console.error('Failed to decrypt text. Ensure the input is valid base64.');
  process.exit(1);
}
