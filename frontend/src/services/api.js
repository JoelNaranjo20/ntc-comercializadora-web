const BASE_URL = '/api';

/**
 * Base fetch wrapper with error handling and JSON parsing.
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, config);

    // Try to parse JSON
    let data;
    try {
      data = await response.json();
    } catch {
      // Non-JSON response
      if (!response.ok) {
        throw new Error(`Error del servidor (${response.status})`);
      }
      return { success: true };
    }

    if (!response.ok) {
      const message = data.message || `Error del servidor (${response.status})`;
      const error = new Error(message);
      error.status = response.status;
      error.data = data;

      if (response.status === 401 && !endpoint.includes('/admin/auth')) {
        window.dispatchEvent(new CustomEvent('admin_unauthorized', { detail: message }));
      }

      throw error;
    }

    return data;
  } catch (err) {
    // Network or other error
    if (!err.status) {
      err.message = err.message || 'Error de conexión. Verifique su internet.';
    }
    throw err;
  }
}

export const api = {
  get: (endpoint, options = {}) =>
    request(endpoint, { ...options }),
  post: (endpoint, body, options = {}) =>
    request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
      headers: { ...options.headers },
    }),
  put: (endpoint, body, options = {}) =>
    request(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
      headers: { ...options.headers },
    }),
  patch: (endpoint, body, options = {}) =>
    request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...options,
      headers: { ...options.headers },
    }),
  delete: (endpoint, options = {}) =>
    request(endpoint, { method: 'DELETE', ...options, headers: { ...options.headers } }),
};

export default api;
