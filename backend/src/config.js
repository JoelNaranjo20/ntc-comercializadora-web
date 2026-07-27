const path = require('path');

// Load .env from project root or backend directory
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
require('dotenv').config(); // fallback to default .env resolution

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  gmail: {
    user: process.env.GMAIL_USER || 'ntcdelnorte@gmail.com',
    appPassword: process.env.GMAIL_APP_PASSWORD || '',
  },
  admin: {
    pin: process.env.ADMIN_PIN || '1234',
    sessionTimeoutMin: parseInt(process.env.SESSION_TIMEOUT_MIN, 10) || 30,
  },
  upload: {
    maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 15,
    maxGalleryImages: parseInt(process.env.MAX_GALLERY_IMAGES, 10) || 50,
  },
  env: process.env.NODE_ENV || 'development',
  isProduction: (process.env.NODE_ENV || 'development') === 'production',
  paths: {
    data: path.resolve(__dirname, 'data'),
    uploads: path.resolve(__dirname, '..', 'uploads', 'gallery'),
    frontendDist: path.resolve(__dirname, '..', '..', 'frontend', 'dist'),
  },
};

module.exports = config;
