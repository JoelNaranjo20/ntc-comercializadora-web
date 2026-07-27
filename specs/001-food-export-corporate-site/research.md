# Research & Technology Decisions: Sitio Web Corporativo

**Date**: 2026-07-24
**Feature**: [spec.md](spec.md)

## Decisions

### D1: React + Vite (Sobre Next.js)

- **Decision**: React 18 con Vite 5 como bundler, sin SSR.
- **Rationale**: El sitio es una landing page corporativa de una sola página sin rutas dinámicas, autenticación de usuarios, ni contenido que requiera SEO server-side. Vite ofrece HMR instantáneo, build rápido, y configuración mínima. Next.js agregaría complejidad innecesaria (SSR/SSG, routing basado en archivos) sin beneficio real para este caso de uso. El SEO básico se puede lograr con meta tags en el HTML estático.
- **Alternatives considered**:
  - **Next.js**: Rechazado — overkill para una SPA sin múltiples rutas ni necesidad de SSR. La complejidad adicional del App Router y el server rendering no se justifica para una landing page.
  - **Create React App**: Rechazado — deprecado, más lento que Vite, configuración más pesada.

### D2: Node.js + Express (Backend)

- **Decision**: Express 4 como servidor API, sirviendo también los estáticos de producción.
- **Rationale**: El backend es ligero (2-3 endpoints: contacto, subida de imágenes, autenticación PIN). Express es minimalista, bien documentado, y suficiente para este alcance. En producción sirve los archivos estáticos del build de Vite, simplificando el despliegue a un solo servidor.
- **Alternatives considered**:
  - **Fastify**: Rechazado — más rápido pero con ecosistema más pequeño para middleware de upload (Multer está diseñado para Express).
  - **API Routes puro (sin framework)**: Rechazado — Express proporciona middleware de parsing, CORS, y static serving que aceleran el desarrollo.

### D3: TailwindCSS (Estilos)

- **Decision**: TailwindCSS 3 con configuración de tema corporativo (azules, blancos, verdes suaves).
- **Rationale**: Permite un diseño consistente y profesional con utility classes, elimina CSS no utilizado en producción (PurgeCSS integrado), y acelera el desarrollo de componentes responsive. El tema corporativo se define en `tailwind.config.js` con colores y tipografía personalizados.
- **Alternatives considered**:
  - **CSS Modules**: Rechazado — más verboso para mantener consistencia visual entre componentes. TailwindCSS ofrece mejor DX para diseño responsive.
  - **Styled Components**: Rechazado — agrega overhead de runtime CSS-in-JS que contradice el requisito de rendimiento ligero.

### D4: Framer Motion (Animaciones)

- **Decision**: Framer Motion 11 para animaciones de entrada (fade-in al scroll, transiciones del hero, animaciones suaves).
- **Rationale**: API declarativa que se integra naturalmente con React. Soporta animaciones al scroll (useInView), stagger children, y variantes para reutilizar configuraciones de animación. Más ligero que alternativas como GSAP para el nivel de animación requerido.
- **Alternatives considered**:
  - **CSS Animations puro**: Rechazado parcialmente — se usará para animaciones simples (hover, transitions), pero Framer Motion es necesario para animaciones al scroll (intersection observer) y stagger effects que serían tediosos con CSS puro.
  - **GSAP**: Rechazado — muy potente pero más pesado y complejo para animaciones de landing page.

### D5: Multer + Sharp (Upload y Optimización de Imágenes)

- **Decision**: Multer para manejar la subida de archivos en Express. Sharp para redimensionar, comprimir y convertir imágenes a WebP.
- **Rationale**: Multer es el middleware estándar de Express para multipart/form-data. Sharp es la librería más rápida de procesamiento de imágenes en Node.js (basada en libvips), ideal para optimización automática al subir: redimensiona a tamaños responsivos, comprime, y convierte a formatos eficientes.
- **Alternatives considered**:
  - **Busboy directamente**: Rechazado — Multer ya lo abstrae y agrega funcionalidad útil (límites de tamaño, filtros de tipo).
  - **Jimp**: Rechazado — más lento que Sharp (basado en JS puro vs C++/libvips).

### D6: Almacenamiento Local (Sin Base de Datos)

- **Decision**: Archivos JSON planos para metadatos de galería (`data/gallery.json`). Archivos de imagen en `uploads/gallery/`. Datos de productos en `data/products.json`.
- **Rationale**: Cumple la restricción de "no usar bases de datos externas". Para ~50 imágenes, un archivo JSON (lectura/escritura con `fs.promises`) es suficiente y no requiere instalación/configuración de base de datos. El producto es ligero y autónomo.
- **Alternatives considered**:
  - **SQLite**: Rechazado — aunque es ligero y no requiere servidor externo, el volumen de datos no lo justifica. JSON plano es más simple de respaldar y migrar.
  - **Lowdb**: Rechazado — agrega una dependencia innecesaria cuando `fs.readFile/writeFile` con JSON.parse/stringify es suficiente.

### D7: Nodemailer (Envío de Correos)

- **Decision**: Nodemailer con transporte SMTP de Gmail (usando App Password).
- **Rationale**: Especificado explícitamente en los requisitos. Para Gmail, se requiere una "App Password" (contraseña de aplicación) generada desde la cuenta de Google. El backend expone el endpoint `POST /api/contact` que valida los campos y envía el correo a ntcdelnorte@gmail.com.
- **Alternatives considered**:
  - **SendGrid / Resend API**: Rechazado — agregan dependencia de servicio externo con límites de free tier. Nodemailer con Gmail es gratuito y suficiente para el volumen esperado de consultas de contacto.
  - **mailto: links**: Rechazado — no profesional para un sitio corporativo.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Gmail App Password no configurado | Medio — formulario no funcional hasta que se configure | Incluir `.env.example` claro con instrucciones; formulario muestra error amigable si el backend falla |
| Archivo JSON de galería corrupto por concurrencia | Bajo — solo 1 admin, operaciones secuenciales | Usar `fs.promises.writeFile` con bloqueo simple (flag `wx` o escritura atómica con archivo temporal + rename) |
| Imágenes/GIFs grandes degradan rendimiento | Medio — visitantes en conexiones lentas | Sharp optimiza automáticamente; lazy loading en frontend; límite de 10 MB por archivo |
