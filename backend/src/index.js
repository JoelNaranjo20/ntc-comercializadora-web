const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded gallery images
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// --------------- Routes (registered by phases) ---------------
// Will be populated as we build user stories:
// Gallery routes (US1)
app.use('/api/gallery', require('./routes/gallery'));
// Contact routes (US2)
app.use('/api/contact', require('./routes/contact'));
// Admin routes (US3)
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: config.env });
});

// --------------- Production: serve frontend build ---------------
if (config.isProduction) {
  const distPath = config.paths.frontendDist;
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

// --------------- Error Handling ---------------
app.use(notFoundHandler);
app.use(globalErrorHandler);

// --------------- Start (Only if run directly) ---------------
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`[NTC] Server running on http://localhost:${config.port}`);
    console.log(`[NTC] Environment: ${config.env}`);
    console.log(`[NTC] Uploads: ${config.paths.uploads}`);
  });
}

module.exports = app;
