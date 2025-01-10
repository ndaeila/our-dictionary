const fs = require('fs');
const path = require('path');

const envExample = path.join(__dirname, '..', '.env.example');
const envFile = path.join(__dirname, '..', '.env');

// Copy .env.example to .env if .env doesn't exist
if (!fs.existsSync(envFile)) {
  fs.copyFileSync(envExample, envFile);
  console.log('Created .env file from .env.example');
} else {
  console.log('.env file already exists');
} 