import api from './api';

const TOKEN_KEY = 'ntc_admin_token';

// --------------- Token Management ---------------

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

/**
 * Creates authenticated headers for admin API calls.
 */
function authHeaders() {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

// --------------- API Calls ---------------

/**
 * Authenticate with PIN. Stores token in sessionStorage on success.
 */
export async function adminAuth(pin) {
  const data = await api.post('/admin/auth', { pin });
  if (data.success && data.token) {
    setToken(data.token);
  }
  return data;
}

/**
 * Verify current session validity.
 */
export async function checkSession() {
  const token = getToken();
  if (!token) return { valid: false };
  try {
    const data = await api.get('/admin/session', { headers: authHeaders() });
    return data;
  } catch (err) {
    if (err.status === 401) {
      clearToken();
    }
    throw err;
  }
}

/**
 * Get product information.
 */
export async function getProducts() {
  return api.get('/admin/products', { headers: authHeaders() });
}

/**
 * Upload a new gallery image (single).
 * @param {File} file
 * @param {object} meta - { section, layoutFormat, title, displayOrder }
 */
export async function uploadImage(file, meta = {}) {
  const formData = new FormData();
  if (meta.section) formData.append('section', meta.section);
  if (meta.layoutFormat) formData.append('layoutFormat', meta.layoutFormat);
  if (meta.aspectRatio) formData.append('aspectRatio', meta.aspectRatio);
  if (meta.objectPosition) formData.append('objectPosition', meta.objectPosition);
  if (meta.effect) formData.append('effect', meta.effect);
  if (meta.gridColumns) formData.append('gridColumns', String(meta.gridColumns));
  if (meta.category) formData.append('category', meta.category);
  if (meta.title) formData.append('title', meta.title);
  if (meta.quality) formData.append('quality', meta.quality);
  if (meta.maxWidth) formData.append('maxWidth', String(meta.maxWidth));
  formData.append('displayOrder', String(meta.displayOrder ?? -1));

  // File MUST be appended LAST in FormData for Multer to receive text fields in req.body
  formData.append('image', file);

  return api.post('/admin/gallery', formData, { headers: authHeaders() });
}

/**
 * Upload multiple gallery images at once (batch).
 * @param {File[]} files - Array of files
 * @param {object} meta - { section, layoutFormat, category, aspectRatio, objectPosition, effect, quality, maxWidth }
 */
export async function uploadImagesBatch(files, meta = {}) {
  const formData = new FormData();
  if (meta.section) formData.append('section', meta.section);
  if (meta.layoutFormat) formData.append('layoutFormat', meta.layoutFormat);
  if (meta.aspectRatio) formData.append('aspectRatio', meta.aspectRatio);
  if (meta.objectPosition) formData.append('objectPosition', meta.objectPosition);
  if (meta.effect) formData.append('effect', meta.effect);
  if (meta.gridColumns) formData.append('gridColumns', String(meta.gridColumns));
  if (meta.category) formData.append('category', meta.category);
  if (meta.quality) formData.append('quality', meta.quality);
  if (meta.maxWidth) formData.append('maxWidth', String(meta.maxWidth));

  // Files MUST be appended LAST in FormData for Multer to receive text fields in req.body
  files.forEach((file) => formData.append('images', file));

  return api.post('/admin/gallery/batch', formData, { headers: authHeaders() });
}

/**
 * Update image metadata (section, layoutFormat, title) without re-uploading.
 * @param {string} id
 * @param {object} meta - { section, layoutFormat, title }
 */
export async function updateImageMeta(id, meta) {
  return api.patch(`/admin/gallery/${id}/meta`, meta, { headers: authHeaders() });
}

/**
 * Bulk update metadata (section, layoutFormat) for multiple images.
 * @param {string[]} ids
 * @param {object} meta - { section, layoutFormat }
 */
export async function bulkUpdateImages(ids, meta) {
  return api.post('/admin/gallery/bulk-meta', { ids, ...meta }, { headers: authHeaders() });
}

/**
 * Bulk delete multiple images.
 * @param {string[]} ids
 */
export async function bulkDeleteImages(ids) {
  return api.post('/admin/gallery/bulk-delete', { ids }, { headers: authHeaders() });
}

/**
 * Replace an existing image with a new file.
 */
export async function replaceImage(id, file) {
  const formData = new FormData();
  formData.append('image', file);

  return api.put(`/admin/gallery/${id}`, formData, { headers: authHeaders() });
}

/**
 * Delete an image permanently.
 */
export async function deleteImage(id) {
  return api.delete(`/admin/gallery/${id}`, { headers: authHeaders() });
}

/**
 * Reorder all gallery images.
 * @param {string[]} orderedIds - Array of image IDs in new order
 */
export async function reorderImages(orderedIds) {
  return api.put('/admin/gallery/reorder', { order: orderedIds }, { headers: authHeaders() });
}

/**
 * Update section metadata (title, layoutFormat, gridColumns).
 */
export async function updateSectionMeta(sectionId, meta) {
  return api.put(`/admin/sections/${sectionId}`, meta, { headers: authHeaders() });
}

/**
 * Logout: clear token and session storage.
 */
export function logout() {
  clearToken();
}
