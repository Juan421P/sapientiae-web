// lib/network.js (versión minimal-fix)

const API_BASE = 'https://sapientiae-api-bd9a54b3d7a1.herokuapp.com/api';

const interceptors = {
  request: [],
  response: [],
  error: []
};

export class Network {

  static get(config)    { return this._request({ method: 'GET',    ...config }); }
  static post(config)   { return this._request({ method: 'POST',   ...config }); }
  static put(config)    { return this._request({ method: 'PUT',    ...config }); }
  static patch(config)  { return this._request({ method: 'PATCH',  ...config }); }
  static delete(config) { return this._request({ method: 'DELETE', ...config }); }

  static async _request(config) {
    const {
      path,
      method = 'GET',
      body = null,
      // 🔧 default en true; acepta true/false o 'include'/'omit' por compatibilidad
      includeCredentials = true,
      headers = {}
    } = config;

    // normalizar bandera: true | 'include' => include, false | 'omit' => omit
    const sendCreds = includeCredentials === true || includeCredentials === 'include';

    console.info('[Network] Network request:', {
      path,
      method,
      includeCredentials: sendCreds ? 'include' : 'omit',
      hasBody: !!body
    });

    let url = `${API_BASE}${path}`;
    console.info(`[Network] Full URL: ${url}`);

    // ✅ credenciales correctas
    let options = {
      method,
      headers: { ...headers },
      credentials: sendCreds ? 'include' : 'omit'
    };

    // ⚠️ Solo setear Content-Type cuando mandamos body (evita preflights en GET)
    if (body != null && method !== 'GET') {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }

    console.info('[Network] Request options:', {
      method: options.method,
      credentials: options.credentials,
      headers: options.headers
    });

    // Interceptores REQUEST
    for (const fn of interceptors.request) {
      const modified = await fn({ url, options });
      if (modified) ({ url, options } = modified);
    }

    console.info('[Network] Making fetch request... 🤔');
    const res = await fetch(url, options);

    console.info('[Network] Response status:', res.status, res.statusText);
    console.info('[Network] Response headers:');
    res.headers.forEach((value, name) => console.info(`[Network] ${name}: ${value}`));

    // ❌ No intentes leer Set-Cookie en browser (siempre null)
    // console.info('[Network] Set-Cookie header:', res.headers.get('Set-Cookie'));

    if (!res.ok) {
      let error = await this._buildError(res);
      for (const fn of interceptors.error) error = (await fn(error)) || error;
      throw error;
    }

    // ✅ parseo seguro (maneja 204 o body vacío)
    let data;
    try { data = await res.json(); } catch { data = {}; }

    // Interceptores RESPONSE
    for (const fn of interceptors.response) {
      data = (await fn(data)) || data;
    }

    console.info('[Network] Request successful');
    return data;
  }

  static async _buildError(res) {
    const payload = await res.json().catch(() => ({}));
    return {
      status: res.status,
      message: payload.message || res.statusText || 'Error',
      details: Array.isArray(payload.errors)
        ? payload.errors
        : (payload.errors && typeof payload.errors === 'object')
          ? Object.values(payload.errors).flat()
          : []
    };
  }

  static get interceptors() { return interceptors; }
}
