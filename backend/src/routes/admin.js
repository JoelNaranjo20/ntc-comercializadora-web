const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const { authenticatePin, requireAuth } = require('../middleware/auth');
const { upload, checkGalleryCapacity, ALLOWED_TYPES } = require('../middleware/upload');
const { processImage, removeImageFiles } = require('../services/imageProcessor');
const galleryStore = require('../services/galleryStore');

// Ensure data files exist
galleryStore.ensureGalleryExists();

// --------------- Auth ---------------

/**
 * POST /api/admin/auth
 * Authenticate with PIN. Returns session token.
 */
router.post('/auth', (req, res) => {
  const { pin } = req.body;
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';

  if (!pin) {
    return res.status(400).json({ success: false, message: 'PIN requerido.' });
  }

  const result = authenticatePin(pin, ip);

  if (!result.success) {
    return res.status(401).json({ success: false, message: result.message });
  }

  res.json({
    success: true,
    token: result.token,
    expiresIn: result.expiresIn,
  });
});

/**
 * GET /api/admin/session
 * Verify current session is still valid.
 */
router.get('/session', requireAuth, (req, res) => {
  const elapsed = Date.now() - req.adminSession.createdAt;
  const timeout = config.admin.sessionTimeoutMin * 60 * 1000;
  const remaining = Math.max(0, Math.round((timeout - (Date.now() - req.adminSession.lastActivity)) / 1000));

  res.json({
    valid: true,
    expiresIn: remaining,
  });
});

// --------------- Products ---------------

/**
 * GET /api/admin/products
 * Returns static product information.
 */
router.get('/products', requireAuth, (req, res) => {
  try {
    const productsFile = path.join(config.paths.data, 'products.json');
    if (!fs.existsSync(productsFile)) {
      return res.json({ products: [] });
    }
    const data = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
    res.json(data);
  } catch (err) {
    console.error('[admin] Error reading products:', err.message);
    res.status(500).json({ success: false, message: 'Error al obtener productos.' });
  }
});

// --------------- Gallery CRUD ---------------

/**
 * POST /api/admin/gallery
 * Upload a new gallery image (single).
 */
router.post('/gallery', requireAuth, checkGalleryCapacity, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Seleccione un archivo para subir.',
      });
    }

    // Validate MIME type (double-check after multer)
    if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Formato no permitido. Use JPG, PNG, WebP, o GIF.',
      });
    }

    const id = uuidv4();
    const processed = await processImage(
      req.file.path,
      id,
      req.file.mimetype,
      { quality: req.body.quality || 'medium', maxWidth: req.body.maxWidth || 1200 }
    );

    const image = galleryStore.addImage({
      id,
      filename: processed.filename,
      originalName: req.file.originalname,
      mimeType: processed.mimeType,
      sizeBytes: processed.sizeBytes,
      originalSizeBytes: processed.originalSizeBytes,
      width: processed.width,
      height: processed.height,
      section: req.body.section || 'galeria',
      layoutFormat: req.body.layoutFormat || 'grid',
      aspectRatio: req.body.aspectRatio || '4/3',
      objectPosition: req.body.objectPosition || 'center',
      effect: req.body.effect || 'zoom-gradient',
      gridColumns: req.body.gridColumns ? parseInt(req.body.gridColumns, 10) : 3,
      category: req.body.category || (req.file.mimetype === 'image/gif' ? 'gif' : 'general'),
      title: req.body.title || '',
      displayOrder: req.body.displayOrder != null ? parseInt(req.body.displayOrder, 10) : -1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Ensure displayOrder was assigned
    const finalImage = galleryStore.getImageById(id);

    res.status(201).json({
      success: true,
      image: {
        ...finalImage,
        url: `/uploads/gallery/${finalImage.filename}`,
        thumbnailUrl: `/uploads/gallery/thumb_${finalImage.filename}`,
      },
    });
  } catch (err) {
    console.error('[admin] Error uploading image:', err.message);
    // Clean up temp file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    res.status(500).json({ success: false, message: err.message || 'Error al subir la imagen.' });
  }
});

/**
 * POST /api/admin/gallery/batch
 * Upload multiple gallery images at once (up to 10).
 */
router.post('/gallery/batch', requireAuth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Seleccione al menos un archivo para subir.',
      });
    }

    const section = req.body.section || 'galeria';
    const layoutFormat = req.body.layoutFormat || 'grid';
    const aspectRatio = req.body.aspectRatio || '4/3';
    const objectPosition = req.body.objectPosition || 'center';
    const effect = req.body.effect || 'zoom-gradient';
    const gridColumns = req.body.gridColumns ? parseInt(req.body.gridColumns, 10) : 3;
    const category = req.body.category || 'general';
    const results = [];
    const errors = [];

    for (const file of req.files) {
      try {
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          errors.push({ file: file.originalname, message: 'Formato no permitido.' });
          continue;
        }

        const id = uuidv4();
        const processed = await processImage(file.path, id, file.mimetype, {
          quality: req.body.quality || 'medium',
          maxWidth: req.body.maxWidth || 1200,
        });

        const image = galleryStore.addImage({
          id,
          filename: processed.filename,
          originalName: file.originalname,
          mimeType: processed.mimeType,
          sizeBytes: processed.sizeBytes,
          originalSizeBytes: processed.originalSizeBytes,
          width: processed.width,
          height: processed.height,
          section,
          layoutFormat,
          aspectRatio,
          objectPosition,
          effect,
          gridColumns,
          category: file.mimetype === 'image/gif' ? 'gif' : category,
          title: '',
          displayOrder: -1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        const finalImage = galleryStore.getImageById(id);
        results.push({
          ...finalImage,
          url: `/uploads/gallery/${finalImage.filename}`,
          thumbnailUrl: `/uploads/gallery/thumb_${finalImage.filename}`,
        });
      } catch (fileErr) {
        errors.push({ file: file.originalname, message: fileErr.message });
        if (fs.existsSync(file.path)) {
          try { fs.unlinkSync(file.path); } catch {}
        }
      }
    }

    res.status(201).json({
      success: true,
      uploaded: results.length,
      failed: errors.length,
      images: results,
      errors,
    });
  } catch (err) {
    console.error('[admin] Error batch uploading:', err.message);
    // Clean up any temp files
    if (req.files) {
      req.files.forEach((f) => {
        if (fs.existsSync(f.path)) {
          try { fs.unlinkSync(f.path); } catch {}
        }
      });
    }
    res.status(500).json({ success: false, message: err.message || 'Error en la carga por lotes.' });
  }
});

/**
 * PATCH /api/admin/gallery/:id/meta
 * Update image metadata (section, layoutFormat, category, title) without re-uploading.
 */
router.patch('/gallery/:id/meta', requireAuth, (req, res) => {
  try {
    const existing = galleryStore.getImageById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Imagen no encontrada.' });
    }

    const updated = galleryStore.updateImageMeta(req.params.id, {
      section: req.body.section,
      layoutFormat: req.body.layoutFormat,
      aspectRatio: req.body.aspectRatio,
      objectPosition: req.body.objectPosition,
      effect: req.body.effect,
      gridColumns: req.body.gridColumns,
      category: req.body.category,
      title: req.body.title,
    });

    res.json({
      success: true,
      image: {
        ...updated,
        url: `/uploads/gallery/${updated.filename}`,
        thumbnailUrl: `/uploads/gallery/thumb_${updated.filename}`,
      },
    });
  } catch (err) {
    console.error('[admin] Error updating meta:', err.message);
    res.status(500).json({ success: false, message: 'Error al actualizar metadatos.' });
  }
});

/**
 * POST /api/admin/gallery/bulk-meta
 * Bulk update metadata (section, layoutFormat, category, aspectRatio, objectPosition, effect) for multiple images.
 */
router.post('/gallery/bulk-meta', requireAuth, (req, res) => {
  try {
    const { ids, section, layoutFormat, aspectRatio, objectPosition, effect, gridColumns, category } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Se requiere una lista de IDs.' });
    }

    const updatedList = galleryStore.bulkUpdateMeta(ids, { section, layoutFormat, aspectRatio, objectPosition, effect, gridColumns, category });
    res.json({ success: true, count: updatedList.length, images: updatedList });
  } catch (err) {
    console.error('[admin] Error in bulk meta update:', err.message);
    res.status(500).json({ success: false, message: 'Error al actualizar imágenes en lote.' });
  }
});

/**
 * POST /api/admin/gallery/bulk-delete
 * Delete multiple images permanently.
 */
router.post('/gallery/bulk-delete', requireAuth, (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Se requiere una lista de IDs.' });
    }

    let deletedCount = 0;
    ids.forEach((id) => {
      const removed = galleryStore.deleteImage(id);
      if (removed) {
        removeImageFiles(removed.filename);
        deletedCount++;
      }
    });

    res.json({ success: true, count: deletedCount });
  } catch (err) {
    console.error('[admin] Error in bulk delete:', err.message);
    res.status(500).json({ success: false, message: 'Error al eliminar imágenes en lote.' });
  }
});

/**
 * PUT /api/admin/gallery/:id
 * Replace an existing image.
 */
router.put('/gallery/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const existing = galleryStore.getImageById(req.params.id);
    if (!existing) {
      // Clean up uploaded file
      if (req.file) try { fs.unlinkSync(req.file.path); } catch {}
      return res.status(404).json({ success: false, message: 'Imagen no encontrada.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Seleccione un archivo para subir.' });
    }

    if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Formato no permitido. Use JPG, PNG, WebP, o GIF.',
      });
    }

    // Remove old files
    removeImageFiles(existing.filename);

    // Process new image (use new UUID for filename to avoid conflicts)
    const newId = uuidv4();
    const processed = await processImage(req.file.path, newId, req.file.mimetype);

    const updated = galleryStore.replaceImage(req.params.id, {
      filename: processed.filename,
      originalName: req.file.originalname,
      mimeType: processed.mimeType,
      sizeBytes: processed.sizeBytes,
      width: processed.width,
      height: processed.height,
    });

    res.json({
      success: true,
      image: {
        ...updated,
        url: `/uploads/gallery/${updated.filename}`,
        thumbnailUrl: `/uploads/gallery/thumb_${updated.filename}`,
      },
    });
  } catch (err) {
    console.error('[admin] Error replacing image:', err.message);
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    res.status(500).json({ success: false, message: 'Error al reemplazar la imagen.' });
  }
});

/**
 * DELETE /api/admin/gallery/:id
 * Delete an image permanently.
 */
router.delete('/gallery/:id', requireAuth, (req, res) => {
  try {
    const removed = galleryStore.deleteImage(req.params.id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Imagen no encontrada.' });
    }
    removeImageFiles(removed.filename);
    res.json({ success: true, message: 'Imagen eliminada correctamente.' });
  } catch (err) {
    console.error('[admin] Error deleting image:', err.message);
    res.status(500).json({ success: false, message: 'Error al eliminar la imagen.' });
  }
});

/**
 * PUT /api/admin/gallery/reorder
 * Reorder all gallery images.
 */
router.put('/gallery/reorder', requireAuth, (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) {
      return res.status(400).json({
        success: false,
        message: 'El formato de orden es inválido. Se requiere un arreglo de IDs.',
      });
    }

    const images = galleryStore.reorderImages(order);
    const imagesWithUrls = images.map((img) => ({
      ...img,
      url: `/uploads/gallery/${img.filename}`,
      thumbnailUrl: `/uploads/gallery/thumb_${img.filename}`,
    }));

    res.json({ success: true, images: imagesWithUrls });
  } catch (err) {
    console.error('[admin] Error reordering:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/admin/sections
 */
router.get('/sections', requireAuth, (req, res) => {
  try {
    const sections = galleryStore.getSections();
    res.json({ success: true, sections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * PUT /api/admin/sections/:id
 */
router.put('/sections/:id', requireAuth, (req, res) => {
  try {
    const updated = galleryStore.upsertSection(req.params.id, req.body);
    res.json({ success: true, section: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * DELETE /api/admin/sections/:id
 */
router.delete('/sections/:id', requireAuth, (req, res) => {
  try {
    const removed = galleryStore.deleteSection(req.params.id);
    if (!removed) return res.status(404).json({ success: false, message: 'Sección no encontrada.' });
    res.json({ success: true, message: 'Sección eliminada.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
