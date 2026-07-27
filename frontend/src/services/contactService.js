import api from './api';

/**
 * Validates contact form fields and returns error messages (Spanish).
 */
function validate({ name, email, message }) {
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres.';
  } else if (name.trim().length > 100) {
    errors.name = 'El nombre no debe exceder los 100 caracteres.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.email = 'Ingrese un correo electrónico válido.';
  }

  if (!message || message.trim().length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres.';
  } else if (message.trim().length > 2000) {
    errors.message = 'El mensaje no debe exceder los 2000 caracteres.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    },
  };
}

/**
 * Submits the contact form to the backend.
 */
export async function submitContact(formData) {
  const { valid, errors, sanitized } = validate(formData);

  if (!valid) {
    const error = new Error('Error de validación.');
    error.validationErrors = errors;
    throw error;
  }

  return api.post('/contact', {
    name: sanitized.name,
    email: sanitized.email,
    message: sanitized.message,
    _website: '', // honeypot field — intentionally empty
  });
}

export { validate };
