const express = require('express');
const router = express.Router();
const galleryStore = require('../services/galleryStore');

// Initialize gallery data file on first access
galleryStore.ensureGalleryExists();

/**
 * GET /api/gallery
 * Returns all gallery images ordered by displayOrder.
 */
router.get('/', (req, res) => {
  try {
    const images = galleryStore.getAllImages(req.query);
    // Attach public URLs to each image
    const imagesWithUrls = images.map((img) => ({
      ...img,
      url: `/uploads/gallery/${img.filename}`,
      thumbnailUrl: `/uploads/gallery/thumb_${img.filename}`,
    }));
    const sections = galleryStore.getSections();
    res.json({ images: imagesWithUrls, sections });
  } catch (err) {
    console.error('[gallery] Error listing images:', err.message);
    res.status(500).json({ success: false, message: 'Error al obtener las imágenes.' });
  }
});

module.exports = router;
