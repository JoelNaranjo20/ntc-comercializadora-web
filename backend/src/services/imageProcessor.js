const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const config = require('../config');

/**
 * Quality presets for image compression.
 */
const QUALITY_PRESETS = {
  low:    { displayQuality: 60, thumbQuality: 50, label: 'Baja (más ligera)' },
  medium: { displayQuality: 75, thumbQuality: 65, label: 'Media (recomendada)' },
  high:   { displayQuality: 85, thumbQuality: 75, label: 'Alta (más detalle)' },
  max:    { displayQuality: 95, thumbQuality: 85, label: 'Máxima (sin pérdida visible)' },
};

/**
 * Resolution presets for max image width.
 */
const RESOLUTION_PRESETS = {
  800:  { maxWidth: 800,  label: '800px (redes sociales)' },
  1200: { maxWidth: 1200, label: '1200px (web estándar)' },
  1920: { maxWidth: 1920, label: '1920px (Full HD)' },
  2560: { maxWidth: 2560, label: '2560px (2K)' },
};

/**
 * Process an uploaded image:
 * - For static images (JPG, PNG, WebP): converts to WebP with configurable quality/resolution
 * - For GIFs: keeps original format, creates smaller thumb version
 *
 * @param {string} sourcePath - Path to the uploaded file
 * @param {string} targetName - Target filename without extension
 * @param {string} mimeType - Original MIME type
 * @param {object} compressionOpts - { quality: 'low'|'medium'|'high'|'max', maxWidth: 800|1200|1920|2560 }
 * @returns {Promise<{ filename, mimeType, sizeBytes, width, height, originalSizeBytes }>}
 */
async function processImage(sourcePath, targetName, mimeType, compressionOpts = {}) {
  const isGif = mimeType === 'image/gif';
  const uploadDir = config.paths.uploads;

  // Get original file size for comparison
  const originalStats = fs.statSync(sourcePath);
  const originalSizeBytes = originalStats.size;

  if (isGif) {
    // GIF: keep as-is for display, create a smaller thumbnail
    const ext = '.gif';
    const displayName = `${targetName}${ext}`;
    const displayPath = path.join(uploadDir, displayName);

    // Copy original as display
    fs.copyFileSync(sourcePath, displayPath);

    // Try to create a smaller version as "thumb"
    try {
      const thumbName = `thumb_${targetName}${ext}`;
      const thumbPath = path.join(uploadDir, thumbName);
      try {
        await sharp(sourcePath, { animated: true })
          .resize({ width: 400, withoutEnlargement: true })
          .toFile(thumbPath);
      } catch {
        fs.copyFileSync(sourcePath, thumbPath);
      }
    } catch {
      // If thumb creation fails entirely, skip it
    }

    // Get final size
    const stats = fs.statSync(displayPath);

    // Clean up source temp file
    if (sourcePath !== displayPath && sourcePath !== path.join(uploadDir, `upload_${targetName}${ext}`)) {
      try { fs.unlinkSync(sourcePath); } catch {}
    }

    let dimensions = { width: 0, height: 0 };
    try {
      const meta = await sharp(displayPath).metadata();
      dimensions = { width: meta.width || 0, height: meta.height || 0 };
    } catch {}

    return {
      filename: displayName,
      mimeType: 'image/gif',
      sizeBytes: stats.size,
      originalSizeBytes,
      ...dimensions,
    };
  } else {
    // Static images: convert to WebP with configurable compression
    const qualityKey = compressionOpts.quality || 'medium';
    const preset = QUALITY_PRESETS[qualityKey] || QUALITY_PRESETS.medium;
    const maxWidth = parseInt(compressionOpts.maxWidth, 10) || 1200;

    const displayExt = '.webp';
    const thumbExt = '.webp';
    const displayName = `${targetName}${displayExt}`;
    const thumbName = `thumb_${targetName}${thumbExt}`;
    const displayPath = path.join(uploadDir, displayName);
    const thumbPath = path.join(uploadDir, thumbName);

    // Create display version
    await sharp(sourcePath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: preset.displayQuality })
      .toFile(displayPath);

    // Create thumbnail (400px width)
    await sharp(sourcePath)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: preset.thumbQuality })
      .toFile(thumbPath);

    // Get dimensions and final size
    const meta = await sharp(displayPath).metadata();
    const stats = fs.statSync(displayPath);

    // Clean up source temp file
    try { fs.unlinkSync(sourcePath); } catch {}

    const compressionRatio = originalSizeBytes > 0
      ? Math.round((1 - stats.size / originalSizeBytes) * 100)
      : 0;

    console.log(`[imageProcessor] ${path.basename(sourcePath)} → ${displayName} | ${qualityKey} quality @ ${maxWidth}px | ${formatBytes(originalSizeBytes)} → ${formatBytes(stats.size)} (${compressionRatio}% reducción)`);

    return {
      filename: displayName,
      mimeType: 'image/webp',
      sizeBytes: stats.size,
      originalSizeBytes,
      width: meta.width || 0,
      height: meta.height || 0,
    };
  }
}

/**
 * Format bytes to human readable string.
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Remove image files from disk (display + thumb).
 */
function removeImageFiles(filename) {
  const uploadDir = config.paths.uploads;
  const displayPath = path.join(uploadDir, filename);
  const ext = path.extname(filename);
  const baseName = path.basename(filename, ext);
  const thumbPath = path.join(uploadDir, `thumb_${baseName}${ext}`);

  try { fs.unlinkSync(displayPath); } catch (err) { /* ignore */ }
  try { fs.unlinkSync(thumbPath); } catch (err) { /* ignore */ }
}

module.exports = { processImage, removeImageFiles, QUALITY_PRESETS, RESOLUTION_PRESETS };
