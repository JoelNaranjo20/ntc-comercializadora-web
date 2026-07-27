# Tasks: Sitio Web Corporativo de Exportación de Alimentos

**Input**: Design documents from [specs/001-food-export-corporate-site/](.)

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: Not explicitly requested in feature specification — test tasks are omitted. Manual validation via quickstart.md scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure: `frontend/src/` and `backend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation for both frontend and backend

- [x] T001 Scaffold backend project structure: `backend/src/`, `backend/src/routes/`, `backend/src/middleware/`, `backend/src/services/`, `backend/src/data/`, `backend/uploads/gallery/`
- [x] T002 Initialize backend npm project with package.json and install dependencies: express, cors, dotenv, nodemailer, multer, sharp, uuid in `backend/package.json`
- [x] T003 Scaffold frontend project with Vite + React: `frontend/src/components/layout/`, `frontend/src/components/sections/`, `frontend/src/components/admin/`, `frontend/src/components/ui/`, `frontend/src/hooks/`, `frontend/src/services/`
- [x] T004 Initialize frontend npm project with Vite + React and install dependencies: react, react-dom, tailwindcss, postcss, autoprefixer, framer-motion in `frontend/package.json`
- [x] T005 [P] Configure TailwindCSS with corporate theme (blues, whites, soft greens) and content paths in `frontend/tailwind.config.js`
- [x] T006 [P] Configure PostCSS with TailwindCSS and autoprefixer plugins in `frontend/postcss.config.js`
- [x] T007 [P] Configure Vite dev server with proxy (/api → localhost:3000) in `frontend/vite.config.js`
- [x] T008 [P] Create backend .env.example with GMAIL_USER, GMAIL_APP_PASSWORD, ADMIN_PIN, SESSION_TIMEOUT_MIN, MAX_FILE_SIZE_MB, MAX_GALLERY_IMAGES in `backend/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [x] T009 Create Express server entry point with CORS, JSON parsing, static file serving for /uploads and production frontend build in `backend/src/index.js`
- [x] T010 [P] Create environment config loader with defaults for all variables in `backend/src/config.js`
- [x] T011 [P] Create centralized error handling middleware (404, 500, validation errors) with Spanish error messages in `backend/src/middleware/errorHandler.js`

### Frontend Foundation

- [x] T012 Create HTML entry point with Spanish lang attribute, meta tags (viewport, description), and root div in `frontend/index.html`
- [x] T013 [P] Create global CSS with Tailwind directives and custom corporate base styles (typography, scroll-behavior) in `frontend/src/index.css`
- [x] T014 Create React entry point rendering App component into root in `frontend/src/main.jsx`
- [x] T015 [P] Create base Button component with corporate variants (primary, secondary, outline) in `frontend/src/components/ui/Button.jsx`
- [x] T016 [P] Create base Input component with label, error state, and styling in `frontend/src/components/ui/Input.jsx`
- [x] T017 [P] Create base Modal component with overlay, close button, animation in `frontend/src/components/ui/Modal.jsx`
- [x] T018 [P] Create base Card component with shadow, padding, and hover variants in `frontend/src/components/ui/Card.jsx`
- [x] T019 Create TopBar component (fixed, above all content) showing email ntcdelnorte@gmail.com and phone placeholder in `frontend/src/components/layout/TopBar.jsx`

### App Shell

- [x] T020 Create main App component composing TopBar + scrollable sections placeholder in `frontend/src/App.jsx`

**Checkpoint**: Foundation ready — backend accepts requests at :3000, frontend renders at :5173 with TopBar visible. User story implementation can now begin.

---

## Phase 3: User Story 1 — Explorar Sitio Web Corporativo (Priority: P1) 🎯 MVP

**Goal**: Deliver the full public-facing corporate website with Hero section, About section, corporate image gallery grid, and Footer. Visitors can browse and understand the company's value proposition.

**Independent Test**: Open http://localhost:5173, navigate through all public sections (Hero → About → Gallery → Footer), verify TopBar is always visible, verify responsive layout on mobile and desktop, verify gallery images load with fade-in animation on scroll.

### Backend for US1

- [x] T021 [P] [US1] Create galleryStore service: read/write gallery.json, atomic write via temp file + rename, ordered image retrieval in `backend/src/services/galleryStore.js`
- [x] T022 [US1] Create GET /api/gallery endpoint returning all images ordered by displayOrder with URLs in `backend/src/routes/gallery.js`
- [x] T023 [US1] Create seed data files: empty gallery.json and sample products.json in `backend/src/data/gallery.json` and `backend/src/data/products.json`
- [x] T024 [US1] Register /api/gallery route in Express server in `backend/src/index.js`

### Frontend for US1

- [x] T025 [P] [US1] Create api service base (fetch wrapper with base URL, error handling, JSON parsing) in `frontend/src/services/api.js`
- [x] T026 [US1] Create useScrollAnimation hook (IntersectionObserver, triggers fadeIn when element enters viewport) in `frontend/src/hooks/useScrollAnimation.js`
- [x] T027 [P] [US1] Create useLazyImage hook (loads image only when near viewport, returns placeholder → loaded transition) in `frontend/src/hooks/useLazyImage.js`
- [x] T028 [P] [US1] Create HeroSection component: full-viewport hero with corporate headline text, CTA buttons, background image/gradient, Framer Motion entrance animation in `frontend/src/components/sections/HeroSection.jsx`
- [x] T029 [P] [US1] Create AboutSection component: "Sobre Nosotros" with company history, mission, value proposition text blocks in corporate layout in `frontend/src/components/sections/AboutSection.jsx`
- [x] T030 [US1] Create GallerySection component: fetch images from GET /api/gallery, render responsive CSS grid/mosaic, fade-in animation per image on scroll, lazy loading, empty state message, support for GIFs in `frontend/src/components/sections/GallerySection.jsx`
- [x] T031 [P] [US1] Create Footer component: corporate info, contact details, relevant links, responsive column layout in `frontend/src/components/layout/Footer.jsx`
- [x] T032 [US1] Compose all public sections into App component: TopBar → Hero → About → Gallery → Contact placeholder → Footer with smooth scroll behavior in `frontend/src/App.jsx`

**Checkpoint**: Public corporate site fully functional. All sections (Hero, About, Gallery, Footer) visible, responsive, with animations. Gallery images load from backend.

---

## Phase 4: User Story 2 — Enviar Consulta de Contacto (Priority: P2)

**Goal**: Visitors can submit contact inquiries via a validated form. Messages are delivered to ntcdelnorte@gmail.com via Nodemailer. Duplicate submissions are prevented.

**Independent Test**: Fill contact form with test data, submit, verify success message appears, verify email arrives at ntcdelnorte@gmail.com. Test validation: empty fields, invalid email, double-click prevention.

### Backend for US2

- [x] T033 [US2] Create mailer service: Nodemailer transporter with Gmail SMTP, sendMail function that formats contact inquiry to ntcdelnorte@gmail.com in `backend/src/services/mailer.js`
- [x] T034 [US2] Create POST /api/contact endpoint: validate name/email/message fields, honeypot check, call mailer.sendMail, return success/error with Spanish messages in `backend/src/routes/contact.js`
- [x] T035 [US2] Register /api/contact route in Express server in `backend/src/index.js`

### Frontend for US2

- [x] T036 [US2] Create contactService: POST to /api/contact, field validation (name required 2-100 chars, email format, message 10-2000 chars), error mapping in `frontend/src/services/contactService.js`
- [x] T037 [P] [US2] Create ContactSection component: form with Name/Email/Message Input components, honeypot hidden field, submit button with loading state, success toast/message, field error display, double-click prevention via disabled state in `frontend/src/components/sections/ContactSection.jsx`
- [x] T038 [US2] Integrate ContactSection into App component replacing contact placeholder in `frontend/src/App.jsx`

**Checkpoint**: Contact form fully functional. Valid submissions reach the email inbox. Validation errors display correctly. Double-click prevented.

---

## Phase 5: User Story 3 — Gestionar Contenido desde Panel Admin (Priority: P3)

**Goal**: Administrators can access a hidden admin panel via CTRL+J with PIN authentication, upload/replace/delete/reorder corporate gallery images, and view static product information.

**Independent Test**: Press CTRL+J, enter PIN 1234, verify admin panel opens. Upload an image (JPG < 10MB), verify it appears in public gallery. Replace an image. Delete an image. Reorder via drag & drop. Verify session expires after 30 minutes of inactivity.

### Backend for US3

- [x] T039 [US3] Create auth middleware: validate Bearer token against in-memory session store, check expiry (30 min inactivity), return 401 with Spanish message on failure in `backend/src/middleware/auth.js`
- [x] T040 [US3] Create upload middleware: Multer config with 10MB limit, file type filter (JPG, PNG, WebP, GIF), 20 image max check, Spanish error messages in `backend/src/middleware/upload.js`
- [x] T041 [US3] Create imageProcessor service: Sharp pipeline for resize (1200px display, 400px thumb), WebP conversion (skip for GIFs), quality optimization in `backend/src/services/imageProcessor.js`
- [x] T042 [US3] Create POST /api/admin/auth endpoint: validate PIN against config, generate session token (UUID), store session with inactivity timer, rate limit 5 attempts/15 min, return token + expiresIn in `backend/src/routes/admin.js`
- [x] T043 [US3] Create GET /api/admin/session endpoint: verify token validity, return remaining time, extend inactivity timer in `backend/src/routes/admin.js`
- [x] T044 [US3] Create GET /api/admin/products endpoint: read and return products.json data in `backend/src/routes/admin.js`
- [x] T045 [US3] Create POST /api/admin/gallery endpoint: receive multipart upload, validate via upload middleware, process with Sharp, save to uploads/gallery/, append metadata to gallery.json, return created image in `backend/src/routes/admin.js`
- [x] T046 [US3] Create PUT /api/admin/gallery/:id endpoint: replace existing image file, update metadata in gallery.json, preserve displayOrder in `backend/src/routes/admin.js`
- [x] T047 [US3] Create DELETE /api/admin/gallery/:id endpoint: remove image file from disk (display + thumb), remove entry from gallery.json in `backend/src/routes/admin.js`
- [x] T048 [US3] Create PUT /api/admin/gallery/reorder endpoint: accept ordered array of image IDs, validate all IDs present (no missing/extraneous), update displayOrder in gallery.json atomically in `backend/src/routes/admin.js`
- [x] T049 [US3] Register all /api/admin routes in Express server with auth middleware in `backend/src/index.js`

### Frontend for US3

- [x] T050 [US3] Create adminService: all admin API calls (auth, session, products, gallery CRUD, reorder), Bearer token management in sessionStorage, auto-logout on 401 in `frontend/src/services/adminService.js`
- [x] T051 [US3] Create useKeyboardShortcut hook: listen for CTRL+J, toggle admin modal visibility, cleanup on unmount in `frontend/src/hooks/useKeyboardShortcut.js`
- [x] T052 [P] [US3] Create PinAuth component: PIN input (4 digits, masked), submit on 4th digit or enter, error display (generic message), loading state in `frontend/src/components/admin/PinAuth.jsx`
- [x] T053 [P] [US3] Create ProductInfo component: read-only table/cards showing products from GET /api/admin/products (name, category, description) in `frontend/src/components/admin/ProductInfo.jsx`
- [x] T054 [US3] Create ImageUploader component: file input with drag zone, type validation (JPG/PNG/WebP/GIF), size check (10MB), progress indicator, error display, success callback in `frontend/src/components/admin/ImageUploader.jsx`
- [x] T055 [US3] Create ImageManager component: gallery grid with images, drag & drop reorder (with up/down buttons as fallback), replace button per image (re-triggers ImageUploader), delete button with confirmation dialog, empty state message in `frontend/src/components/admin/ImageManager.jsx`
- [x] T056 [US3] Create AdminModal component: Modal wrapper with tabs/sections for Product Info and Image Manager, session timer display, close button, inactivity auto-logout integration in `frontend/src/components/admin/AdminModal.jsx`
- [x] T057 [US3] Wire useKeyboardShortcut → PinAuth → AdminModal flow: CTRL+J opens PinAuth modal, valid PIN reveals AdminModal, session storage for token, 401 response from adminService triggers re-auth in `frontend/src/App.jsx`

**Checkpoint**: Full admin panel functional. Images can be uploaded, replaced, deleted, and reordered from the admin panel. Changes reflect immediately on public gallery. Product info visible in admin panel. Session times out after 30 minutes of inactivity.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Production readiness, performance optimization, and final validation

- [x] T058 [P] Configure production build: Express serves built frontend static files from `frontend/dist/` when NODE_ENV=production in `backend/src/index.js`
- [x] T059 [P] Add frontend build script and backend start script to root or document commands in `frontend/package.json` and `backend/package.json`
- [x] T060 [P] SEO basics: add meta description, title, og:image, favicon reference in `frontend/index.html`
- [x] T061 Image loading state animations: skeleton/spinner placeholders while gallery images load in `frontend/src/components/sections/GallerySection.jsx`
- [x] T062 Error boundary component: catch rendering errors, display fallback UI in Spanish, log to console in `frontend/src/components/ui/ErrorBoundary.jsx`
- [x] T063 Responsive polish pass: verify all sections at 320px, 768px, 1024px, 1440px, 2560px widths, fix any overflow/text truncation issues across all section and admin components
- [x] T064 Animation performance audit: ensure all Framer Motion animations use `will-change` sparingly, prefer `opacity` and `transform` only, verify 60fps scrolling in browser DevTools
- [x] T065 Run full quickstart.md validation: execute all 6 validation scenarios (VS-1 through VS-6) in `specs/001-food-export-corporate-site/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational — No dependencies on other stories
- **User Story 2 (Phase 4)**: Depends on Foundational — Independent from US1 (appends ContactSection to App)
- **User Story 3 (Phase 5)**: Depends on Foundational — Independent from US1/US2 (appends AdminModal to App, reuses /api/gallery from US1)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories. Backend gallery API + frontend public sections
- **US2 (P2)**: No dependencies on other stories. Independent backend contact route + frontend section. Appends to App.jsx
- **US3 (P3)**: Depends on US1 only for GET /api/gallery (galleryStore service reused). Admin manages same images displayed in US1 gallery

### Within Each User Story

- Backend: services → routes → register in index.js
- Frontend: hooks → services → components → integrate in App.jsx
- Components marked [P] within a story can be built in parallel

### Parallel Opportunities

- **Phase 1**: T005, T006, T007, T008 can all run in parallel
- **Phase 2**: T010, T011 (backend) run parallel with T013, T015-T018 (frontend UI)
- **Phase 3 (US1)**: T025, T026, T027 (hooks) parallel; T028, T029, T031 (sections) parallel
- **Phase 4 (US2)**: T033 (backend mailer) and T037 (frontend contact section) can proceed in parallel once T036 (contactService) is ready
- **Phase 5 (US3)**: T052, T053 (PinAuth, ProductInfo) parallel in frontend; T039, T040, T041 (middleware, upload, imageProcessor) parallel in backend
- **Across stories**: Once Phase 2 completes, US1, US2, and US3 can be developed in parallel by different developers

---

## Parallel Example: User Story 1

```bash
# Backend (sequential within US1):
Task: "Create galleryStore service in backend/src/services/galleryStore.js"
Task: "Create GET /api/gallery endpoint in backend/src/routes/gallery.js"
Task: "Create seed data files in backend/src/data/"
Task: "Register /api/gallery route in backend/src/index.js"

# Frontend hooks (parallel):
Task: "Create api service base in frontend/src/services/api.js"
Task: "Create useScrollAnimation hook in frontend/src/hooks/useScrollAnimation.js"
Task: "Create useLazyImage hook in frontend/src/hooks/useLazyImage.js"

# Frontend sections (parallel — different files):
Task: "Create HeroSection in frontend/src/components/sections/HeroSection.jsx"
Task: "Create AboutSection in frontend/src/components/sections/AboutSection.jsx"
Task: "Create Footer in frontend/src/components/layout/Footer.jsx"
```

## Parallel Example: User Story 3 (Backend)

```bash
# Backend middleware (parallel — different files):
Task: "Create auth middleware in backend/src/middleware/auth.js"
Task: "Create upload middleware in backend/src/middleware/upload.js"
Task: "Create imageProcessor service in backend/src/services/imageProcessor.js"

# Then admin routes (all in same file — sequential):
Task: "Create POST /api/admin/auth endpoint in backend/src/routes/admin.js"
Task: "Create GET /api/admin/session endpoint in backend/src/routes/admin.js"
...
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup → both projects scaffolded and running
2. Complete Phase 2: Foundational → Express serving, React rendering with TopBar
3. Complete Phase 3: User Story 1 → Full public corporate site live
4. **STOP and VALIDATE**: All public sections visible, gallery loads images, responsive works
5. Deploy/demo if ready — this is a functional corporate website

### Incremental Delivery

1. **Setup + Foundational** → Foundation with TopBar visible at :5173
2. **+ US1** → Full public site: Hero, About, Gallery, Footer → **MVP DONE** 🎯
3. **+ US2** → Contact form functional, emails sending → **Lead generation live**
4. **+ US3** → Admin panel for image management, product info → **Self-service content management**
5. **+ Polish** → Production build, SEO, responsive perfection → **Production ready**

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - **Developer A**: Backend for US1 (galleryStore, GET /api/gallery) + Backend for US2 (mailer, POST /api/contact)
   - **Developer B**: Frontend for US1 (HeroSection, AboutSection, GallerySection, Footer)
   - **Developer C**: Backend for US3 (auth, upload, imageProcessor, admin routes)
3. Developer B finishes US1 frontend → picks up US2 frontend (ContactSection) or US3 frontend (AdminModal)
4. All stories integrate in App.jsx independently

---

## Notes

- [P] tasks = different files, no dependencies — can run in parallel
- [US*] label maps task to specific user story for traceability
- Each user story can be independently tested per quickstart.md scenarios
- No database — gallery.json and products.json are read/written with fs.promises
- GIF uploads are stored as-is (not converted to WebP); Sharp processes only static images
- Admin session is in-memory (cleared on server restart, admin re-authenticates)
- Commit after each task or logical group of [P] tasks
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
