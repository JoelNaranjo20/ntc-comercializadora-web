/**
 * Centralized error handling middleware.
 * Returns Spanish error messages consistent with the spec's contracts.
 */

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'Recurso no encontrado.',
  });
}

function validationError(res, errors) {
  return res.status(400).json({
    success: false,
    message: 'Error de validación.',
    errors,
  });
}

function genericError(res, message) {
  return res.status(400).json({
    success: false,
    message,
  });
}

function internalError(res, err) {
  console.error('[ERROR]', err?.message || err);
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor. Intente nuevamente más tarde.',
  });
}

function globalErrorHandler(err, req, res, _next) {
  // Multer-specific errors
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'El archivo excede el límite de 10 MB.',
    });
  }
  if (err && err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Archivo inesperado en la solicitud.',
    });
  }
  console.error('[UNHANDLED]', err?.message || err, err?.stack);
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor.',
  });
}

module.exports = {
  notFoundHandler,
  validationError,
  genericError,
  internalError,
  globalErrorHandler,
};
