import { Network } from './../lib/network';

export class SocialServiceService {

    static _ENDPOINT = '/SocialService';

    static async get() {
        return await Network.get({
            path: `${this._ENDPOINT}/getDataSocialService`
        });
    }

    static async getPagination(page = 0, size = 10) {
        return await Network.get({
            path: `${this._ENDPOINT}/getSocialServicePagination?page=${page}&size=${size}`
        });
    }

    static async post(data) {
        return await Network.post({
            path: `${this._ENDPOINT}/newSocialService`,
            body: data
        });
    }

    static async put(id, data) {
        return await Network.put({
            path: `${this._ENDPOINT}/updateSocialService/${id}`,
            body: data
        });
    }

    static async delete(id) {
        return await Network.delete({
            path: `${this._ENDPOINT}/deleteSocialService/${id}`
        });
    }
}