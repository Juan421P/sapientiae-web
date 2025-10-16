import { Network } from './../lib/network.js';

export class PensumService {

    static _ENDPOINT = '/Pensum';

    static async get() {
        return await Network.get({
            path: `${this._ENDPOINT}/getPensa`
        });
    }

    static async getPagination(page = 0, size = 10) {
        return await Network.get({
            path: `${this._ENDPOINT}/getPensumPagination?page=${page}&size=${size}`
        });
    }

    static async post(data) {
        return await Network.post({
            path: `${this._ENDPOINT}/newPensum`,
            body: data
        });
    }

    static async put(id, data) {
        return await Network.put({
            path: `${this._ENDPOINT}/updatePensum/${id}`,
            body: data
        });
    }

    static async delete(id) {
        return await Network.delete({
            path: `${this._ENDPOINT}/deletePensum/${id}`
        });
    }
}