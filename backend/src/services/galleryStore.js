const fs = require("fs");
const path = require("path");
const config = require("../config");

const GALLERY_FILE = path.join(config.paths.data, "gallery.json");

const VALID_SECTIONS = ["galeria", "hero", "nosotros", "productos"];
const VALID_LAYOUTS = ["grid", "carousel"];
const VALID_ASPECTS = ["4/3", "1/1", "16/9", "3/4"];
const VALID_POSITIONS = ["center", "top", "bottom", "left", "right"];
const VALID_EFFECTS = ["zoom", "gradient", "zoom-gradient", "none"];
const VALID_CATEGORIES = ["platano", "papas", "cebolla", "limon", "name", "tierra", "gif", "general", "nosotros_quienes", "nosotros_valores"];
const VALID_GRID_COLUMNS = [2, 3, 4, 5, 6];

const DEFAULT_SECTIONS = [
  { id: "carousel", title: "Carrusel Destacado", subtitle: "Nuestros productos estrella", description: "", layoutFormat: "carousel", gridColumns: 3, order: 0, enabled: true },
  { id: "platano", title: "Plátanos Frescos", subtitle: "Del campo a su mesa", description: "", layoutFormat: "grid", gridColumns: 3, order: 1, enabled: true },
  { id: "papas", title: "Papas de Calidad", subtitle: "Frescas y seleccionadas", description: "", layoutFormat: "grid", gridColumns: 3, order: 2, enabled: true },
  { id: "cebolla", title: "Cebolla Premium", subtitle: "Selección especial", description: "", layoutFormat: "grid", gridColumns: 3, order: 3, enabled: true },
  { id: "limon", title: "Limones Naturales", subtitle: "Ácidos y frescos", description: "", layoutFormat: "grid", gridColumns: 3, order: 4, enabled: true },
  { id: "name", title: "Ñame Artesanal", subtitle: "Tradición del campo", description: "", layoutFormat: "grid", gridColumns: 3, order: 5, enabled: true },
  { id: "tierra", title: "Campo y Tierra", subtitle: "Nuestros cultivos", description: "", layoutFormat: "grid", gridColumns: 3, order: 6, enabled: true },
  { id: "gif", title: "GIFs Animados", subtitle: "Momentos en movimiento", description: "", layoutFormat: "grid", gridColumns: 3, order: 7, enabled: true },
  { id: "general", title: "Productos Generales", subtitle: "Nuestra oferta completa", description: "", layoutFormat: "grid", gridColumns: 3, order: 8, enabled: true },
];

function readGallery() {
  try {
    if (!fs.existsSync(GALLERY_FILE)) return { images: [], sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)) };
    const raw = fs.readFileSync(GALLERY_FILE, "utf-8");
    const data = JSON.parse(raw);
    if (!data.sections) data.sections = JSON.parse(JSON.stringify(DEFAULT_SECTIONS));
    return data;
  } catch (err) {
    console.error("[galleryStore] Error reading gallery:", err.message);
    return { images: [], sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)) };
  }
}

function writeGallery(data) {
  const tmpFile = GALLERY_FILE + ".tmp";
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmpFile, GALLERY_FILE);
}

function getAllImages(filters = {}) {
  const gallery = readGallery();
  let images = gallery.images.sort((a, b) => a.displayOrder - b.displayOrder);
  if (filters.section && VALID_SECTIONS.includes(filters.section)) images = images.filter((img) => img.section === filters.section);
  if (filters.layoutFormat && VALID_LAYOUTS.includes(filters.layoutFormat)) images = images.filter((img) => img.layoutFormat === filters.layoutFormat);
  if (filters.category) images = images.filter((img) => img.category === filters.category);
  return images;
}

function getImageById(id) {
  const gallery = readGallery();
  return gallery.images.find((img) => img.id === id) || null;
}

function addImage(imageData) {
  const gallery = readGallery();
  if (gallery.images.length >= config.upload.maxGalleryImages) throw new Error("Limite de imagenes alcanzado.");
  if (imageData.displayOrder == null || imageData.displayOrder < 0) {
    const maxOrder = gallery.images.reduce((max, img) => Math.max(max, img.displayOrder), -1);
    imageData.displayOrder = maxOrder + 1;
  }
  if (!imageData.section || !VALID_SECTIONS.includes(imageData.section)) imageData.section = "galeria";
  if (!imageData.layoutFormat || !VALID_LAYOUTS.includes(imageData.layoutFormat)) imageData.layoutFormat = "grid";
  if (!imageData.aspectRatio || !VALID_ASPECTS.includes(imageData.aspectRatio)) imageData.aspectRatio = "4/3";
  if (!imageData.objectPosition || !VALID_POSITIONS.includes(imageData.objectPosition)) imageData.objectPosition = "center";
  if (!imageData.effect || !VALID_EFFECTS.includes(imageData.effect)) imageData.effect = "zoom-gradient";
  if (!imageData.gridColumns || !VALID_GRID_COLUMNS.includes(Number(imageData.gridColumns))) { imageData.gridColumns = 3; } else { imageData.gridColumns = Number(imageData.gridColumns); }
  if (imageData.mimeType === "image/gif") { imageData.category = "gif"; } else if (!imageData.category) { imageData.category = "general"; }
  gallery.images.push(imageData);
  writeGallery(gallery);
  return imageData;
}

function updateImageMeta(id, meta) {
  const gallery = readGallery();
  const index = gallery.images.findIndex((img) => img.id === id);
  if (index === -1) return null;
  const allowed = {};
  if (meta.section && VALID_SECTIONS.includes(meta.section)) allowed.section = meta.section;
  if (meta.layoutFormat && VALID_LAYOUTS.includes(meta.layoutFormat)) allowed.layoutFormat = meta.layoutFormat;
  if (meta.aspectRatio && VALID_ASPECTS.includes(meta.aspectRatio)) allowed.aspectRatio = meta.aspectRatio;
  if (meta.objectPosition && VALID_POSITIONS.includes(meta.objectPosition)) allowed.objectPosition = meta.objectPosition;
  if (meta.effect && VALID_EFFECTS.includes(meta.effect)) allowed.effect = meta.effect;
  if (meta.gridColumns && VALID_GRID_COLUMNS.includes(Number(meta.gridColumns))) allowed.gridColumns = Number(meta.gridColumns);
  if (meta.category) allowed.category = meta.category;
  if (meta.title !== undefined) allowed.title = meta.title;
  gallery.images[index] = { ...gallery.images[index], ...allowed, updatedAt: new Date().toISOString() };
  writeGallery(gallery);
  return gallery.images[index];
}

function bulkUpdateMeta(ids, meta) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const gallery = readGallery();
  const allowed = {};
  if (meta.section && VALID_SECTIONS.includes(meta.section)) allowed.section = meta.section;
  if (meta.layoutFormat && VALID_LAYOUTS.includes(meta.layoutFormat)) allowed.layoutFormat = meta.layoutFormat;
  if (meta.aspectRatio && VALID_ASPECTS.includes(meta.aspectRatio)) allowed.aspectRatio = meta.aspectRatio;
  if (meta.objectPosition && VALID_POSITIONS.includes(meta.objectPosition)) allowed.objectPosition = meta.objectPosition;
  if (meta.effect && VALID_EFFECTS.includes(meta.effect)) allowed.effect = meta.effect;
  if (meta.gridColumns && VALID_GRID_COLUMNS.includes(Number(meta.gridColumns))) allowed.gridColumns = Number(meta.gridColumns);
  if (meta.category) allowed.category = meta.category;
  const updatedImages = [];
  gallery.images.forEach((img) => {
    if (ids.includes(img.id)) { Object.assign(img, allowed, { updatedAt: new Date().toISOString() }); updatedImages.push(img); }
  });
  writeGallery(gallery);
  return updatedImages;
}

function replaceImage(id, updates) {
  const gallery = readGallery();
  const index = gallery.images.findIndex((img) => img.id === id);
  if (index === -1) return null;
  gallery.images[index] = { ...gallery.images[index], ...updates, updatedAt: new Date().toISOString() };
  writeGallery(gallery);
  return gallery.images[index];
}

function deleteImage(id) {
  const gallery = readGallery();
  const index = gallery.images.findIndex((img) => img.id === id);
  if (index === -1) return false;
  const [removed] = gallery.images.splice(index, 1);
  writeGallery(gallery);
  return removed;
}

function reorderImages(orderedIds) {
  const gallery = readGallery();
  if (orderedIds.length !== gallery.images.length) throw new Error("La lista de orden debe contener todas las imagenes de la galeria.");
  const idSet = new Set(orderedIds);
  const allPresent = gallery.images.every((img) => idSet.has(img.id));
  if (!allPresent) throw new Error("La lista de orden contiene IDs que no existen en la galeria.");
  gallery.images.forEach((img) => { img.displayOrder = orderedIds.indexOf(img.id); img.updatedAt = new Date().toISOString(); });
  writeGallery(gallery);
  return getAllImages();
}

// ============================================================
// SECTIONS
// ============================================================

function getSections() {
  const gallery = readGallery();
  return (gallery.sections || JSON.parse(JSON.stringify(DEFAULT_SECTIONS))).slice().sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

function upsertSection(id, data) {
  if (!id || typeof id !== "string") throw new Error("ID de seccion invalido.");
  const gallery = readGallery();
  if (!gallery.sections) gallery.sections = JSON.parse(JSON.stringify(DEFAULT_SECTIONS));
  const index = gallery.sections.findIndex((s) => s.id === id);
  const now = new Date().toISOString();
  const allowed = { id };
  if (data.title !== undefined) allowed.title = String(data.title).slice(0, 120);
  if (data.subtitle !== undefined) allowed.subtitle = String(data.subtitle).slice(0, 180);
  if (data.description !== undefined) allowed.description = String(data.description).slice(0, 600);
  if (data.order !== undefined) allowed.order = Number(data.order);
  if (data.enabled !== undefined) allowed.enabled = data.enabled === true || data.enabled === "true";
  if (data.layoutFormat && VALID_LAYOUTS.includes(data.layoutFormat)) allowed.layoutFormat = data.layoutFormat;
  if (data.gridColumns && VALID_GRID_COLUMNS.includes(Number(data.gridColumns))) allowed.gridColumns = Number(data.gridColumns);

  if (index === -1) {
    const maxOrder = gallery.sections.reduce((max, s) => Math.max(max, s.order ?? 0), 0);
    gallery.sections.push({
      id,
      title: allowed.title ?? id,
      subtitle: allowed.subtitle ?? "",
      description: allowed.description ?? "",
      layoutFormat: allowed.layoutFormat ?? "grid",
      gridColumns: allowed.gridColumns ?? 3,
      order: allowed.order ?? maxOrder + 1,
      enabled: allowed.enabled ?? true,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    gallery.sections[index] = { ...gallery.sections[index], ...allowed, updatedAt: now };
  }
  writeGallery(gallery);
  return gallery.sections.find((s) => s.id === id);
}

function deleteSection(id) {
  const gallery = readGallery();
  if (!gallery.sections) return false;
  const index = gallery.sections.findIndex((s) => s.id === id);
  if (index === -1) return false;
  const [removed] = gallery.sections.splice(index, 1);
  writeGallery(gallery);
  return removed;
}

function reorderSections(orderedIds) {
  if (!Array.isArray(orderedIds)) throw new Error("orderedIds must be an array.");
  const gallery = readGallery();
  if (!gallery.sections) gallery.sections = JSON.parse(JSON.stringify(DEFAULT_SECTIONS));
  orderedIds.forEach((id, idx) => { const sec = gallery.sections.find((s) => s.id === id); if (sec) sec.order = idx; });
  writeGallery(gallery);
  return getSections();
}

function ensureGalleryExists() {
  const dir = path.dirname(GALLERY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(GALLERY_FILE)) {
    writeGallery({ images: [], sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)) });
  } else {
    const gallery = readGallery();
    if (!gallery.sections) { gallery.sections = JSON.parse(JSON.stringify(DEFAULT_SECTIONS)); writeGallery(gallery); }
  }
}

module.exports = {
  getAllImages, getImageById, addImage, updateImageMeta, bulkUpdateMeta, replaceImage, deleteImage, reorderImages,
  getSections, upsertSection, deleteSection, reorderSections,
  ensureGalleryExists, VALID_SECTIONS, VALID_LAYOUTS,
};
