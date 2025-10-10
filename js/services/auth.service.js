import { Network } from '../lib/network';

export class AuthService {

    static _ENDPOINT = '/Auth';

    static async login(e, p) {
        return await Network.post({
            path: `${this._ENDPOINT}/login`,
            body: {
                "email": e,
                "contrasena": p
            }
        });
    }

    static async me() {
        return await this.get('me', null, null, 'me');
    }

    static async logout() {
        return await this.postRaw('logout');
    }

}