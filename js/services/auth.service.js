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
        return await Network.get({
            path: `${this._ENDPOINT}/me`
        });
    }

    static async logout() {
        return await Network.post({
            path: `${this._ENDPOINT}/logout`
        });
    }

}