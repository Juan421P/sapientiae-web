import { Network } from '../lib/network';

export class LocalitiesService {

    static _ENDPOINT = '/Locality';

    static async get() {
        return await Network.get({
            path: `${this._ENDPOINT}/getDataLocality`
        });
    }

    static async getPagination(page = 0, size = 10) {
        return await Network.get({
            path: `${this._ENDPOINT}/getLocalitiesPagination?page=${page}&size=${size}`
        });
    }

    static async post(data) {
        return await Network.post({
            path: `${this._ENDPOINT}/newLocality`,
            body: data
        });
    }

    static async put(id, data) {
        return await Network.put({
            path: `${this._ENDPOINT}/updateLocality/${id}`,
            body: data
        });
    }

    static async delete(id) {
        return await Network.delete({
            path: `${this._ENDPOINT}/deleteLocation/${id}`
        });
    }
}