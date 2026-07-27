const { v4: uuidv4 } = require('uuid');
const config = require('../config');

/**
 * In-memory session store.
 * Keyed by session token. Stores { token, createdAt, lastActivity }.
 */
const sessions = new Map();

// Clean up expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  const timeout = config.admin.sessionTimeoutMin * 60 * 1000;
  for (const [token, session] of sessions) {
    if (now - session.lastActivity > timeout) {
      sessions.delete(token);
    }
  }
}, 5 * 60 * 1000);

/**
 * Rate limiter for PIN attempts.
 * Keyed by IP. Allows 5 attempts per 15 minutes.
 */
const pinAttempts = new Map();
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 min

function checkPinRateLimit(ip) {
  const now = Date.now();
  const record = pinAttempts.get(ip);

  if (!record || now - record.windowStart > ATTEMPT_WINDOW) {
    pinAttempts.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }

  record.count++;
  return true;
}

function resetPinAttempts(ip) {
  pinAttempts.delete(ip);
}

/**
 * Verifies the PIN and creates a new session.
 */
function authenticatePin(pin, ip) {
  if (!checkPinRateLimit(ip)) {
    return { success: false, message: 'Demasiados intentos. Intente de nuevo en 15 minutos.' };
  }

  const inputPin = String(pin).trim();
  const correctPin = String(config.admin.pin).trim();

  console.log(`[auth] PIN attempt from ${ip} — match: ${inputPin === correctPin}`);

  if (inputPin !== correctPin) {
    return { success: false, message: 'PIN incorrecto.' };
  }

  resetPinAttempts(ip);

  const token = uuidv4();
  const now = Date.now();
  sessions.set(token, {
    token,
    createdAt: now,
    lastActivity: now,
  });

  return {
    success: true,
    token,
    expiresIn: config.admin.sessionTimeoutMin * 60, // seconds
  };
}

/**
 * Express middleware: validates Bearer token and checks inactivity timeout.
 * Adds session to req.adminSession on success.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Acceso no autorizado.',
    });
  }

  const token = header.slice(7);
  const session = sessions.get(token);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Sesión expirada. Ingrese el PIN nuevamente.',
    });
  }

  const timeout = config.admin.sessionTimeoutMin * 60 * 1000;
  const now = Date.now();

  if (now - session.lastActivity > timeout) {
    sessions.delete(token);
    return res.status(401).json({
      success: false,
      message: 'Sesión expirada. Ingrese el PIN nuevamente.',
    });
  }

  // Extend activity timer
  session.lastActivity = now;
  req.adminSession = session;

  next();
}

module.exports = {
  authenticatePin,
  requireAuth,
  sessions,
};
