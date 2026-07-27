const express = require('express');
const router = express.Router();
const { sendContactMail } = require('../services/mailer');
const { validationError, internalError } = require('../middleware/errorHandler');

// Validation helpers
function validateContact(body) {
  const errors = {};
  const { name, email, message } = body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres.';
  }
  if (name && name.trim().length > 100) {
    errors.name = 'El nombre no debe exceder los 100 caracteres.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.email = 'Ingrese un correo electrónico válido.';
  }
  if (email && email.trim().length > 254) {
    errors.email = 'El correo electrónico es demasiado largo.';
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres.';
  }
  if (message && message.trim().length > 2000) {
    errors.message = 'El mensaje no debe exceder los 2000 caracteres.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      name: (name || '').trim(),
      email: (email || '').trim().toLowerCase(),
      message: (message || '').trim(),
    },
  };
}

/**
 * POST /api/contact
 * Validates and sends contact inquiry to ntcdelnorte@gmail.com.
 */
router.post('/', async (req, res) => {
  // Honeypot anti-spam check
  if (req.body._website || req.body.website) {
    // Silently succeed to not reveal detection
    return res.json({
      success: true,
      message: 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.',
    });
  }

  try {
    const { valid, errors, sanitized } = validateContact(req.body);

    if (!valid) {
      return validationError(res, errors);
    }

    await sendContactMail(sanitized);

    res.json({
      success: true,
      message: 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.',
    });
  } catch (err) {
    console.error('[contact] Error sending email:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Error al enviar el mensaje. Intente nuevamente más tarde.',
    });
  }
});

module.exports = router;
