# Feature Specification: Sitio Web Corporativo de Exportación de Alimentos

**Feature Branch**: `001-food-export-corporate-site`

**Created**: 2026-07-24

**Status**: Draft

**Input**: User description: "Crear una web rápida, moderna, responsive y visualmente atractiva para una empresa de exportación de alimentos que incluya: información corporativa, galerías dinámicas de imágenes, testimonios, formulario de contacto funcional, y panel admin oculto para gestión de contenido."

## Clarifications

### Session 2026-07-24

- Q: ¿Cuánto tiempo debe permanecer activa la sesión del panel admin antes de requerir re-autenticación? → A: Timeout por inactividad de 30 minutos.
- Q: ¿Los testimonios deben ser gestionables desde el panel admin? → A: El panel admin mostrará pedidos enviados e información sobre productos. Además, la estructura de la página se redefine: Hero → Sobre Nosotros → Imágenes de la empresa trabajando → Formulario de Contacto → Footer. Se eliminan la sección de Productos (galería tipo carrusel) y la sección de Testimonios.
- Q: ¿Qué información de pedidos/productos debe mostrarse en el panel admin? → A: Una sección informativa estática con datos de los productos que la empresa exporta (tipos de alimentos, categorías, descripciones). Contenido fijo definido durante el desarrollo, no gestionable desde el panel.
- Q: ¿Cuál debe ser el tamaño máximo por archivo que el administrador puede subir a la galería? → A: 10 MB por archivo.
- Q: ¿Cómo deben visualizarse las imágenes corporativas en esta sección? → A: Grid/mosaico estático con animación de entrada al hacer scroll (fade-in). Todas las imágenes visibles simultáneamente en una cuadrícula, sin carrusel.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorar Sitio Web Corporativo (Priority: P1)

Un visitante (potencial cliente o socio comercial) accede al sitio web de la empresa exportadora de alimentos para conocer la compañía, su historia y propuesta de valor, ver imágenes reales de la empresa en operación, y contactar al equipo. El visitante navega a través de las distintas secciones informativas presentadas en una sola página con desplazamiento fluido, en el siguiente orden: hero, sobre nosotros, imágenes de la empresa trabajando, formulario de contacto, y footer.

**Why this priority**: Es el núcleo del sitio web. La presencia corporativa en línea es el objetivo principal del proyecto — sin esta funcionalidad, el sitio no tiene razón de existir. Representa la primera impresión de la empresa ante clientes potenciales.

**Independent Test**: Puede verificarse completamente desplegando la página y navegando por todas las secciones informativas (hero, sobre nosotros, imágenes corporativas, formulario de contacto, footer) en un navegador. Entrega valor como sitio web informativo completo incluso sin el panel admin.

**Acceptance Scenarios**:

1. **Given** un visitante sin conocimiento previo de la empresa, **When** accede a la URL del sitio, **Then** ve una sección hero con mensaje corporativo impactante y botones de llamado a la acción, seguida de la sección "Sobre Nosotros" con información de la empresa, una galería visual de imágenes de la empresa trabajando (empacando productos, enviando alimentos, trabajando la tierra), el formulario de contacto, y el footer con información corporativa.
2. **Given** un visitante en cualquier sección del sitio, **When** observa la parte superior de la página, **Then** ve una barra superior fija con el correo electrónico (ntcdelnorte@gmail.com) y número de teléfono de contacto visibles en todo momento.
3. **Given** un visitante visualizando la sección de imágenes de la empresa, **When** las imágenes o GIFs están presentes, **Then** se muestran en una cuadrícula/mosaico con animación suave de entrada al hacer scroll (fade-in), con todas las imágenes visibles simultáneamente.
4. **Given** un visitante en dispositivo móvil, **When** accede al sitio, **Then** todo el contenido se adapta correctamente al tamaño de pantalla manteniendo la legibilidad y usabilidad.

---

### User Story 2 - Enviar Consulta de Contacto (Priority: P2)

Un visitante interesado en los servicios de la empresa desea ponerse en contacto. Completa el formulario de contacto con su nombre, correo electrónico y mensaje, y lo envía. El sistema procesa el envío y notifica al visitante que su mensaje fue recibido, mientras que el equipo de la empresa recibe la consulta por correo electrónico.

**Why this priority**: Es el canal principal de conversión del sitio — transforma visitantes en prospectos de negocio. Sin embargo, el sitio puede existir y aportar valor informativo sin el formulario (aunque con menor capacidad de generación de leads).

**Independent Test**: Puede verificarse completando el formulario con datos de prueba, enviándolo, y confirmando que el correo llega a ntcdelnorte@gmail.com y que el usuario ve una confirmación visual en pantalla.

**Acceptance Scenarios**:

1. **Given** un visitante que desea contactar a la empresa, **When** completa los campos de nombre, email y mensaje con datos válidos y presiona enviar, **Then** el sistema valida los datos, los envía por correo a ntcdelnorte@gmail.com, y muestra un mensaje de confirmación de envío exitoso.
2. **Given** un visitante que intenta enviar el formulario, **When** deja campos obligatorios vacíos o ingresa un email con formato inválido, **Then** el sistema muestra mensajes de error específicos junto a cada campo problemático y no envía el formulario hasta que todos los datos sean válidos.
3. **Given** un visitante que acaba de enviar el formulario exitosamente, **When** intenta reenviar el mismo formulario inmediatamente (doble clic accidental), **Then** el sistema previene el envío duplicado.

---

### User Story 3 - Gestionar Contenido desde Panel Admin (Priority: P3)

Un administrador de la empresa necesita gestionar el contenido del sitio sin depender de un desarrollador. Accede al panel de administración oculto mediante un atajo de teclado (CTRL+J) e ingresa un PIN de seguridad. Una vez autenticado, puede: ver pedidos enviados y otra información relevante de productos, subir nuevas imágenes corporativas (de la empresa trabajando), reemplazar o eliminar imágenes existentes, y reorganizar el orden de visualización de la galería.

**Why this priority**: Permite mantener el contenido del sitio actualizado sin intervención técnica. Es esencial para la operación continua pero el sitio es completamente funcional sin él en su lanzamiento inicial (las imágenes pueden cargarse manualmente en el despliegue).

**Independent Test**: Puede verificarse accediendo al sitio, presionando CTRL+J, ingresando el PIN 1234, y realizando operaciones CRUD sobre las imágenes corporativas y visualizando la información de pedidos/productos.

**Acceptance Scenarios**:

1. **Given** un usuario en cualquier página del sitio, **When** presiona CTRL+J, **Then** se muestra un modal solicitando un PIN de acceso, sin que exista ningún enlace o botón visible que revele la existencia del panel.
2. **Given** un usuario en el modal de acceso, **When** ingresa el PIN correcto (1234), **Then** el sistema valida la credencial y muestra el panel de administración con la vista de pedidos enviados e información de productos, y las imágenes corporativas actuales.
3. **Given** un usuario en el modal de acceso, **When** ingresa un PIN incorrecto, **Then** el sistema rechaza el acceso y muestra un mensaje de error genérico sin revelar si el PIN fue incorrecto o si existe el panel.
4. **Given** un administrador autenticado en el panel, **When** navega a la sección de imágenes, selecciona un archivo de imagen o GIF desde su dispositivo y confirma la subida, **Then** el sistema almacena el archivo optimizado y lo agrega a la galería visible en el sitio público.
5. **Given** un administrador autenticado en el panel, **When** selecciona una imagen existente y elige eliminarla, **Then** el sistema solicita confirmación y, al confirmar, elimina permanentemente la imagen de la galería.
6. **Given** un administrador autenticado en el panel, **When** selecciona una imagen existente y la reemplaza por un nuevo archivo, **Then** el sistema actualiza la imagen manteniendo su posición en la galería.
7. **Given** un administrador autenticado en el panel, **When** reorganiza el orden de las imágenes en la galería mediante drag & drop (arrastrar y soltar) con botones de subir/bajar como alternativa de accesibilidad, **Then** el nuevo orden se refleja inmediatamente en la galería pública.

---

### Edge Cases

- ¿Cómo se comporta la galería cuando no hay imágenes cargadas (estado inicial vacío)?
- ¿Qué ocurre cuando un visitante con JavaScript deshabilitado intenta usar el formulario de contacto?
- ¿Qué sucede si el servicio de envío de correos no está disponible al enviar el formulario?
- ¿Cómo maneja el sistema la subida de archivos que no son imágenes/GIFs o que exceden los 10 MB permitidos?
- ¿Qué ocurre si el administrador intenta acceder directamente a la ruta del panel admin sin usar CTRL+J?
- ¿Cómo se comporta el mosaico de imágenes con diferentes cantidades de imágenes (1, 2, 5, 10+)?
- ¿Qué sucede si dos administradores intentan modificar la galería simultáneamente?

## Requirements *(mandatory)*

### Functional Requirements

**Secciones Públicas del Sitio**

- **FR-001**: El sistema DEBE mostrar una barra superior fija (top bar) visible en todo momento que contenga el correo electrónico ntcdelnorte@gmail.com y un número de teléfono de contacto (placeholder: "+XX XXXX XXXX", a reemplazar con el número real antes del despliegue final).
- **FR-002**: El sistema DEBE presentar una sección hero con texto corporativo impactante, imagen o fondo visual, y botones de llamado a la acción (CTA) con animaciones suaves de entrada.
- **FR-003**: El sistema DEBE incluir una sección "Sobre Nosotros" con información corporativa de la empresa (historia, misión, propuesta de valor).
- **FR-004**: El sistema DEBE mostrar una sección de imágenes corporativas con mínimo 3 imágenes o GIFs de la empresa en operación (empacando productos, enviando alimentos, trabajando la tierra), en un diseño de cuadrícula/mosaico con todas las imágenes visibles simultáneamente y animación de entrada al hacer scroll (fade-in).
- **FR-005**: El sistema DEBE incluir un formulario de contacto con campos de nombre, email y mensaje que envíe los datos al correo ntcdelnorte@gmail.com.
- **FR-006**: El sistema DEBE presentar un footer con información corporativa adicional, datos de contacto y enlaces relevantes.
- **FR-007**: El sistema DEBE validar los campos del formulario de contacto (nombre requerido, email con formato válido, mensaje requerido) antes de permitir el envío.
- **FR-008**: El sistema DEBE mostrar un mensaje de confirmación al usuario tras el envío exitoso del formulario y prevenir envíos duplicados por doble clic.

**Panel de Administración**

- **FR-009**: El sistema DEBE activar un modal de acceso al panel de administración exclusivamente mediante el atajo de teclado CTRL+J, sin enlaces o botones visibles en la interfaz pública.
- **FR-010**: El sistema DEBE solicitar un PIN numérico (1234) para acceder al panel de administración y validarlo contra el backend (no solo en el frontend).
- **FR-011**: El sistema DEBE mostrar en el panel admin una sección informativa estática con los productos que la empresa exporta (tipos de alimentos, categorías, descripciones), con contenido fijo definido durante el desarrollo.
- **FR-012**: El sistema DEBE permitir al administrador autenticado subir nuevas imágenes corporativas (incluyendo GIFs) a la galería desde su dispositivo local.
- **FR-022**: El sistema DEBE rechazar archivos que excedan los 10 MB de tamaño, mostrando un mensaje de error descriptivo al administrador.
- **FR-013**: El sistema DEBE permitir al administrador autenticado reemplazar una imagen existente por una nueva, manteniendo su posición en la galería.
- **FR-014**: El sistema DEBE permitir al administrador autenticado eliminar imágenes existentes de la galería, solicitando confirmación antes de la eliminación permanente.
- **FR-015**: El sistema DEBE permitir al administrador autenticado reorganizar el orden de visualización de las imágenes en la galería.
- **FR-016**: El sistema DEBE rechazar intentos de acceso a rutas del panel de administración que no provengan de una sesión autenticada válida.
- **FR-020**: El sistema DEBE cerrar automáticamente la sesión del panel de administración tras 30 minutos de inactividad, requiriendo que el administrador vuelva a ingresar el PIN.

**Rendimiento y Experiencia**

- **FR-017**: El sistema DEBE optimizar las imágenes subidas (compresión, redimensionamiento) para minimizar tiempos de carga.
- **FR-018**: El sistema DEBE implementar carga diferida (lazy loading) para todas las imágenes de la galería y contenido fuera de la vista inicial.
- **FR-019**: El sistema DEBE adaptar la interfaz a dispositivos móviles, tablets y escritorio (diseño responsive).
- **FR-021**: El sistema DEBE incluir animaciones suaves en transiciones y elementos visuales sin afectar negativamente el rendimiento de la página.

### Key Entities

- **Imagen Corporativa**: Representa una fotografía o GIF de la empresa en operación. Atributos clave: archivo (imagen/GIF optimizado en múltiples tamaños), orden de visualización, fecha de subida. Pertenece a la galería pública y es gestionada desde el panel admin.
- **Información de Producto**: Representa datos estáticos sobre los productos de exportación de la empresa. Atributos clave: nombre del producto, categoría, descripción. Contenido fijo definido en desarrollo, visible en el panel admin como referencia informativa.
- **Consulta de Contacto**: Representa un mensaje enviado a través del formulario de contacto. Atributos clave: nombre del remitente, email del remitente, contenido del mensaje, fecha y hora de envío. Se transmite por correo electrónico; no requiere persistencia en base de datos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visitante nuevo puede comprender la propuesta de valor de la empresa y ver imágenes reales de la empresa en operación en los primeros 15 segundos de haber cargado el sitio.
- **SC-002**: El sitio web carga su contenido principal (hero, texto corporativo) en menos de 3 segundos en conexiones de banda ancha estándar.
- **SC-003**: La sección de imágenes corporativas muestra su mosaico completo con animaciones de entrada en menos de 2 segundos después de que el visitante hace scroll hasta esa sección.
- **SC-004**: Un visitante puede completar y enviar el formulario de contacto en menos de 1 minuto desde que llega a esa sección.
- **SC-005**: El 100% de los formularios de contacto enviados correctamente llegan al correo ntcdelnorte@gmail.com en menos de 30 segundos tras el envío.
- **SC-006**: Un administrador puede subir una nueva imagen/GIF a la galería y verla publicada en el sitio en menos de 1 minuto (incluyendo optimización automática).
- **SC-007**: El sitio es completamente navegable y legible en dispositivos con anchos de pantalla desde 320px (móvil) hasta 2560px (monitores grandes).
- **SC-008**: El panel de administración es inaccesible sin el atajo de teclado y el PIN correcto, incluso si se intenta acceder directamente por URL.

## Assumptions

- El contenido textual del sitio (textos del hero, sección sobre nosotros) será proporcionado por el cliente o se usarán textos de marcador de posición realistas durante el desarrollo inicial.
- Las imágenes iniciales de la galería corporativa serán proporcionadas por el cliente; se incluirán imágenes de marcador de posición para desarrollo y demostración.
- El sitio está dirigido a una audiencia hispanohablante; todo el contenido público estará en español.
- Los visitantes disponen de navegadores modernos con JavaScript habilitado (Chrome, Firefox, Safari, Edge — últimas 2 versiones principales).
- El servicio de correo electrónico (ntcdelnorte@gmail.com) está configurado y operativo; el sistema usará credenciales de aplicación proporcionadas por el cliente para el envío de correos.
- No se requiere sistema de gestión de usuarios multi-admin; un único PIN compartido (1234) es suficiente para el panel de administración.
- Los archivos subidos al panel admin serán exclusivamente en formatos de imagen estándar (JPG, PNG, WebP) y GIFs; no se requiere soporte para videos u otros medios.
- El sitio se despliega como una aplicación web estándar accesible públicamente (no requiere intranet ni autenticación de visitantes).
- No se requiere integración con sistemas externos de CRM, analíticas avanzadas, ni plataformas de terceros en esta fase.
