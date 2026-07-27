# Quickstart & Validation Guide: Sitio Web Corporativo

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Prerequisites

- Node.js 18+ and npm 9+
- Git Bash or modern terminal
- Gmail account credentials (App Password) for ntcdelnorte@gmail.com

## Setup

### 1. Clone & Install

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env: set GMAIL_USER=ntcdelnorte@gmail.com, GMAIL_APP_PASSWORD=<your-app-password>
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Seed Data

Backend includes default placeholder data:
- `backend/src/data/gallery.json` — empty gallery initially
- `backend/src/data/products.json` — sample product entries
- `backend/uploads/gallery/` — empty initially, images stored here on upload

### 3. Run Development

Terminal 1 — Backend (port 3000):
```bash
cd backend
npm run dev
```

Terminal 2 — Frontend (port 5173, proxies /api to :3000):
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in browser.

### 4. Production Build

```bash
cd frontend && npm run build
cd ../backend && npm start
# Serves frontend static files + API on port 3000
```

## Validation Scenarios

### VS-1: Public Site Navigation (User Story 1)

**Goal**: Verify all public sections render correctly in order.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open http://localhost:5173 | Page loads with Top Bar visible (fixed at top) showing email ntcdelnorte@gmail.com and phone placeholder |
| 2 | Scroll down | Hero section with corporate text, CTA buttons, and background image animates in |
| 3 | Continue scroll | "Sobre Nosotros" section appears with company information |
| 4 | Continue scroll | Image mosaic/grid section appears with fade-in animation. Images visible in grid layout |
| 5 | Continue scroll | Contact form section with Name, Email, Message fields |
| 6 | Continue scroll | Footer with corporate info, contact details, relevant links |
| 7 | Resize browser to 375px width | All sections adapt responsively. Grid collapses to single column. Text remains readable |

### VS-2: Contact Form Submission (User Story 2)

**Goal**: Verify contact form validates and sends email.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Enviar" with all fields empty | Red validation errors appear below each field: "obligatorio" |
| 2 | Enter invalid email "notanemail" and submit | Email field shows "Ingrese un correo electrónico válido" |
| 3 | Fill all fields with valid data. Click "Enviar" | Button shows loading state. Success message: "Mensaje enviado correctamente". Form resets |
| 4 | Double-click "Enviar" rapidly | Only one submission processed (button disabled during send) |
| 5 | Check inbox of ntcdelnorte@gmail.com | Email received with subject "Consulta web - [name]" containing name, email, and message |

### VS-3: Admin Panel Access & Auth (User Story 3)

**Goal**: Verify hidden admin panel access flow.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Press CTRL+J anywhere on the site | Modal appears: "Ingrese PIN de acceso". No visible link/button to admin panel exists on page |
| 2 | Enter "0000" and submit | Error message: "PIN incorrecto" (generic, no hint). Modal stays open |
| 3 | Enter "1234" and submit | PIN modal closes. Admin panel UI opens showing: product info section + image gallery manager |
| 4 | Try navigating directly to /admin in URL bar (without clicking anything) | Access denied or 404 (route hidden/non-existent without session) |

### VS-4: Gallery Image Management (User Story 3)

**Goal**: Verify CRUD operations on gallery images from admin panel.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Authenticated in admin panel. Navigate to Images tab | See current images (or empty state message: "No hay imágenes cargadas") |
| 2 | Click "Subir imagen". Select a JPG < 10 MB | Progress indicator. Image appears in gallery grid with success notification |
| 3 | Upload a PNG file > 10 MB | Error: "El archivo excede el límite de 10 MB" |
| 4 | Try uploading a .pdf file | Error: "Formato no permitido" |
| 5 | Drag & drop an image to reorder (move first image to last position) | Order updates immediately. Notification confirms |
| 6 | Click "Reemplazar" on an image. Select new file | Image updates in place, same position. Old file removed from disk |
| 7 | Click "Eliminar" on an image | Confirmation dialog: "¿Está seguro?" → Confirm → Image removed from grid |
| 8 | Return to public site (close admin panel) | Newly uploaded/modified images visible in public mosaic section |

### VS-5: Admin Session Timeout

**Goal**: Verify session expires after 30 minutes of inactivity.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Authenticate into admin panel | Panel visible |
| 2 | Wait 31 minutes without interacting with admin panel | Next click on admin UI triggers "Sesión expirada. Ingrese el PIN nuevamente." PIN modal re-appears |

### VS-6: Performance Check

**Goal**: Verify load time and optimization requirements.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open browser DevTools → Network tab. Hard reload page | Hero + text content loads in < 3 seconds (DOMContentLoaded) |
| 2 | Scroll to image mosaic section | Images load via lazy loading as they enter viewport |
| 3 | Check image formats in Network tab | Images served as WebP (except GIFs). Thumbnails are small (< 20 KB each) |
| 4 | Run Lighthouse audit (desktop) | Performance score >= 80 |

## Known Limitations (Current Phase)

- Product info in admin panel is read-only (static JSON). Changes require redeploy.
- No multi-admin support — single PIN shared.
- No authentication for public gallery endpoint (read-only, public).
- GIF uploads are stored as-is (not converted to WebP); only resized if dimensions exceed display size.
- Email delivery depends on Gmail SMTP being available and App Password configured.

## Environment Variables

**Backend** (`.env`):

| Variable | Required | Description |
|----------|----------|-------------|
| PORT | No (default 3000) | Server port |
| GMAIL_USER | Yes | ntcdelnorte@gmail.com |
| GMAIL_APP_PASSWORD | Yes | Gmail App Password (16 chars, no spaces) |
| ADMIN_PIN | No (default 1234) | Admin panel PIN |
| SESSION_TIMEOUT_MIN | No (default 30) | Session inactivity timeout in minutes |
| MAX_FILE_SIZE_MB | No (default 10) | Max upload file size in MB |
| MAX_GALLERY_IMAGES | No (default 20) | Max number of gallery images |
| NODE_ENV | Auto | "development" or "production" |
