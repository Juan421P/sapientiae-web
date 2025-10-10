const API_BASE = 'https://sapientiae-api-bd9a54b3d7a1.herokuapp.com/api';

const interceptors = {
    request: [],
    response: [],
    error: []
};

export class Network {

    static get(config) {
        return this._request({
            method: 'GET',
            ...config
        });
    }

    static post(config) {
        return this._request({
            method: 'POST',
            ...config
        });
    }

    static put(config) {
        return this._request({
            method: 'PUT',
            ...config
        });
    }

    static patch(config) {
        return this._request({
            method: 'PATCH',
            ...config
        });
    }

    static delete(config) {
        return this._request({
            method: 'DELETE',
            ...config
        });
    }

    static async _request(config) {
        console.info('[Network] Network request:', {
            path: config.path,
            method: config.method || 'GET',
            includeCredentials: config.includeCredentials,
            credentials: config.includeCredentials ? 'include' : 'omit',
            hasBody: !!config.body
        });
        const {
            path,
            method = 'GET',
            body = null,
            includeCredentials = true,
            headers = {}
        } = config;

        let url = `${API_BASE}${path}`;
        console.info(`[Network] Full URL: ${url}`);

        let options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            credentials: includeCredentials ? 'include' : 'omit'
        };

        console.info(`[Network] Request options:`, {
            method: options.method,
            credentials: options.credentials,
            headers: options.headers
        });

        if (body) options.body = JSON.stringify(body);

        for (const fn of interceptors.request) {
            const modified = await fn({ url, options });
            if (modified) ({ url, options } = modified);
        }

        console.info('[Network] Making fetch request... 🤔');
        const res = await fetch(url, options);

        console.info('[Network] Response status:', res.status, res.statusText);
        console.info('[Network] Response headers:');
        res.headers.forEach((value, name) => {
            console.info(`[Network] ${name}: ${value}`);
        });

        console.info('[Network] Set-Cookie header:', res.headers.get('Set-Cookie'));

        if (!res.ok) {
            let error = await this._buildError(res);
            for (const fn of interceptors.error) {
                error = (await fn(error)) || error;
            }
            throw error;
        }

        let data = await res.json();

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
            message: payload.message || res.statusText,
            details: Array.isArray(payload.errors)
                ? payload.errors
                : typeof payload.errors === 'object'
                    ? Object.values(payload.errors).flat()
                    : []
        };
    }

    static get interceptors() {
        return interceptors;
    }

}