const multer = require('multer');
const path = require('path');
const config = require('../config');
const galleryStore = require('../services/galleryStore');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Multer storage configuration.
 * Saves to backend/uploads/gallery/ with a temporary name (later processed by Sharp).
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.paths.uploads);
  },
  filename: (req, file, cb) => {
    // Generate unique name — will be renamed by imageProcessor
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `upload_${uniqueSuffix}${ext}`);
  },
});

/**
 * File filter: reject non-image files.
 */
function fileFilter(req, file, cb) {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'upload'), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSizeMB * 1024 * 1024, // MB to bytes
  },
});

/**
 * Middleware: check if gallery has room (max images check).
 * Must be called before multer upload to prevent unnecessary file writes.
 */
function checkGalleryCapacity(req, res, next) {
  try {
    galleryStore.ensureGalleryExists();
    const images = galleryStore.getAllImages();
    if (images.length >= config.upload.maxGalleryImages) {
      return res.status(400).json({
        success: false,
        message: `Límite de ${config.upload.maxGalleryImages} imágenes alcanzado. Elimine algunas antes de subir más.`,
      });
    }
    next();
  } catch (err) {
    console.error('[upload] Error checking capacity:', err.message);
    next();
  }
}

module.exports = { upload, checkGalleryCapacity, ALLOWED_TYPES };
