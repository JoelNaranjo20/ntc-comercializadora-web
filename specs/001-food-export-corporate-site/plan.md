# Implementation Plan: Sitio Web Corporativo de Exportación de Alimentos

**Branch**: `001-food-export-corporate-site` | **Date**: 2026-07-24 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from [spec.md](spec.md)

## Summary

Construir un sitio web corporativo de una sola página (landing page) para una empresa exportadora de alimentos con las siguientes secciones: Hero, Sobre Nosotros, Imágenes Corporativas (mosaico/grid), Formulario de Contacto con envío de correo real, y Footer. Incluye un panel de administración oculto (accesible vía CTRL+J con PIN 1234) para gestionar imágenes corporativas y consultar información de productos. Stack: React + Vite (frontend), Node.js + Express (backend), almacenamiento local de archivos, Nodemailer para correos, TailwindCSS para estilos, Framer Motion para animaciones.

## Technical Context

**Language/Version**: JavaScript (ES2022+) / Node.js 18+

**Primary Dependencies**: React 18+, Vite 5+, Express 4+, TailwindCSS 3+, Framer Motion 11+, Nodemailer 6+, Multer (upload de archivos), Sharp (optimización de imágenes)

**Storage**: Archivos locales en `/uploads/gallery/` para imágenes corporativas. Metadatos de imágenes (orden, fecha) en archivo JSON local (`/data/gallery.json`). Sin base de datos externa.

**Testing**: Manual testing y verificación visual durante desarrollo. No se requiere framework de testing automatizado para esta fase.

**Target Platform**: Navegadores modernos (Chrome, Firefox, Safari, Edge — últimas 2 versiones). Dispositivos desktop y móviles (320px a 2560px de ancho).

**Project Type**: Web application (frontend SPA + backend API)

**Performance Goals**: Carga inicial (hero + texto corporativo) < 3 segundos en banda ancha. Imágenes con lazy loading. Animaciones a 60fps.

**Constraints**: Sin bases de datos externas. Sin dependencias innecesariamente complejas. Imágenes optimizadas automáticamente al subir. Máximo 10 MB por archivo subido.

**Scale/Scope**: 1 página pública (~5 secciones). Panel admin con CRUD de imágenes + vista informativa de productos. 1 usuario admin (PIN compartido). ~20-50 imágenes en galería corporativa.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No constitution file found at `/memory/constitution.md`. **No gates to evaluate — proceeding without constitution checks.**

## Project Structure

### Documentation (this feature)

```text
specs/001-food-export-corporate-site/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
└── tasks.md             # Phase 2 output (NOT created by speckit-plan)
```

### Source Code (repository root)

```text
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopBar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── sections/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── AboutSection.jsx
│   │   │   ├── GallerySection.jsx
│   │   │   └── ContactSection.jsx
│   │   ├── admin/
│   │   │   ├── AdminModal.jsx
│   │   │   ├── PinAuth.jsx
│   │   │   ├── ProductInfo.jsx
│   │   │   ├── ImageManager.jsx
│   │   │   └── ImageUploader.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Card.jsx
│   │       └── Modal.jsx
│   ├── hooks/
│   │   ├── useKeyboardShortcut.js
│   │   ├── useScrollAnimation.js
│   │   └── useLazyImage.js
│   ├── services/
│   │   ├── api.js
│   │   ├── contactService.js
│   │   └── adminService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json

backend/
├── src/
│   ├── routes/
│   │   ├── contact.js
│   │   ├── admin.js
│   │   └── gallery.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── services/
│   │   ├── mailer.js
│   │   ├── imageProcessor.js
│   │   └── galleryStore.js
│   ├── data/
│   │   └── products.json
│   └── index.js
├── uploads/
│   └── gallery/
├── package.json
└── .env.example
```

**Structure Decision**: Web application structure (Option 2) selected. Frontend and backend are cleanly separated: Vite dev server proxies API requests to Express backend during development. In production, Express serves the built frontend static files. Gallery images stored as local files with a JSON metadata index — no database required, keeping the setup lightweight as specified.

## Complexity Tracking

No constitution violations to justify.
