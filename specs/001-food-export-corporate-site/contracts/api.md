# API Contracts: Sitio Web Corporativo

**Base URL**: `http://localhost:3000/api` (dev) | `/api` (prod, same origin)

**Content-Type**: `application/json` (except file uploads: `multipart/form-data`)

**Authentication**: Admin endpoints require header `Authorization: Bearer <session-token>`. Token obtained via `POST /api/admin/auth` with valid PIN.

---

## Public Endpoints

### GET /api/gallery

List all gallery images in display order. No authentication required.

**Response** `200 OK`:
```json
{
  "images": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "filename": "a1b2c3d4.webp",
      "originalName": "empacando-productos.jpg",
      "mimeType": "image/webp",
      "sizeBytes": 124800,
      "width": 1200,
      "height": 800,
      "displayOrder": 0,
      "url": "/uploads/gallery/a1b2c3d4.webp",
      "thumbnailUrl": "/uploads/gallery/thumb_a1b2c3d4.webp",
      "createdAt": "2026-07-24T15:00:00.000Z",
      "updatedAt": "2026-07-24T15:00:00.000Z"
    }
  ]
}
```

**Response** `200 OK` (empty gallery):
```json
{
  "images": []
}
```

---

### POST /api/contact

Submit contact form. Sends email to ntcdelnorte@gmail.com. No authentication required.

**Request**:
```json
{
  "name": "Carlos Rodríguez",
  "email": "carlos@example.com",
  "message": "Me interesa conocer más sobre sus productos de exportación."
}
```

**Validation Rules**:
- `name`: required, 2-100 chars
- `email`: required, valid format, max 254 chars
- `message`: required, 10-2000 chars
- Honeypot field (if sent): triggers silent success (anti-spam)

**Response** `200 OK`:
```json
{
  "success": true,
  "message": "Mensaje enviado correctamente. Nos pondremos en contacto pronto."
}
```

**Response** `400 Bad Request`:
```json
{
  "success": false,
  "errors": {
    "name": "El nombre debe tener al menos 2 caracteres.",
    "email": "Ingrese un correo electrónico válido.",
    "message": "El mensaje es obligatorio."
  }
}
```

**Response** `500 Internal Server Error`:
```json
{
  "success": false,
  "message": "Error al enviar el mensaje. Intente nuevamente más tarde."
}
```

---

## Admin Endpoints

All admin endpoints require `Authorization: Bearer <token>` header (except auth).

### POST /api/admin/auth

Authenticate with PIN to obtain admin session token.

**Request**:
```json
{
  "pin": "1234"
}
```

**Response** `200 OK`:
```json
{
  "success": true,
  "token": "b5e6f7g8-h9i0-1234-jklm-n5o6p7q8r9s0",
  "expiresIn": 1800
}
```
- `expiresIn`: seconds until timeout (1800 = 30 min)

**Response** `401 Unauthorized`:
```json
{
  "success": false,
  "message": "PIN incorrecto."
}
```

**Rate Limiting**: 5 attempts per IP per 15 minutes.

---

### GET /api/admin/session

Verify if current session token is still valid.

**Response** `200 OK`:
```json
{
  "valid": true,
  "expiresIn": 1740
}
```

**Response** `401 Unauthorized`:
```json
{
  "valid": false,
  "message": "Sesión expirada. Ingrese el PIN nuevamente."
}
```

---

### GET /api/admin/products

List product information for the admin panel.

**Response** `200 OK`:
```json
{
  "products": [
    {
      "id": "aguacate-hass",
      "name": "Aguacate Hass",
      "category": "Frutas Frescas",
      "description": "Aguacate de calidad de exportación cultivado en suelo fértil.",
      "displayOrder": 0
    }
  ]
}
```

---

### POST /api/admin/gallery

Upload a new gallery image. Content-Type: `multipart/form-data`.

**Request**:
- Field `image`: file (JPG, PNG, WebP, GIF — max 10 MB)
- Field `displayOrder` (optional): integer position. If omitted or -1, appends to end.

**Response** `201 Created`:
```json
{
  "success": true,
  "image": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "filename": "a1b2c3d4.webp",
    "originalName": "empacando-productos.jpg",
    "mimeType": "image/webp",
    "sizeBytes": 124800,
    "width": 1200,
    "height": 800,
    "displayOrder": 0,
    "url": "/uploads/gallery/a1b2c3d4.webp",
    "thumbnailUrl": "/uploads/gallery/thumb_a1b2c3d4.webp",
    "createdAt": "2026-07-24T15:00:00.000Z",
    "updatedAt": "2026-07-24T15:00:00.000Z"
  }
}
```

**Response** `400 Bad Request`:
```json
{
  "success": false,
  "message": "Formato no permitido. Use JPG, PNG, WebP, o GIF."
}
```

**Response** `400 Bad Request` (size):
```json
{
  "success": false,
  "message": "El archivo excede el límite de 10 MB."
}
```

**Response** `400 Bad Request` (limit):
```json
{
  "success": false,
  "message": "Límite de 20 imágenes alcanzado. Elimine algunas antes de subir más."
}
```

---

### PUT /api/admin/gallery/:id

Replace an existing image. Content-Type: `multipart/form-data`.

**Request**:
- Field `image`: new file (same format constraints as upload)

**Response** `200 OK`:
```json
{
  "success": true,
  "image": { /* same shape as POST response, with updated fields */ }
}
```

**Response** `404 Not Found`:
```json
{
  "success": false,
  "message": "Imagen no encontrada."
}
```

---

### DELETE /api/admin/gallery/:id

Delete an image permanently.

**Response** `200 OK`:
```json
{
  "success": true,
  "message": "Imagen eliminada correctamente."
}
```

**Response** `404 Not Found`:
```json
{
  "success": false,
  "message": "Imagen no encontrada."
}
```

---

### PUT /api/admin/gallery/reorder

Update the display order of all images (e.g., after drag & drop reordering).

**Request**:
```json
{
  "order": [
    "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "b2c3d4e5-f6g7-8901-hijk-l6m7n8o9p0q1"
  ]
}
```
- `order`: array of image IDs in new display order. Must include all existing gallery image IDs.

**Response** `200 OK`:
```json
{
  "success": true,
  "images": [ /* re-ordered full image list */ ]
}
```

**Response** `400 Bad Request` (mismatch):
```json
{
  "success": false,
  "message": "La lista de orden debe contener todas las imágenes de la galería."
}
```

---

## Error Response Format

All errors follow this structure:
```json
{
  "success": false,
  "message": "<human-readable Spanish error message>",
  "errors": { /* optional field-level errors */ }
}
```

## Session Management

1. Frontend stores token in `sessionStorage` (not `localStorage` — survives only until tab close)
2. Every admin API call includes `Authorization: Bearer <token>`
3. Backend checks token validity on each request
4. On 401 response, frontend clears token and shows PIN modal
5. Frontend resets inactivity timer on any admin API call or UI interaction
6. After 30 minutes of inactivity, session expires server-side
