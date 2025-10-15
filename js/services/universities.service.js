import { Network } from './../lib/network';

export class UniversityService {

    static _ENDPOINT = '/University';

    static async get() {
        return await Network.get({
            path: `${this._ENDPOINT}/getDataUniversity`
        });
    }

    static async getPagination(page = 0, size = 10) {
        return await Network.get({
            path: `${this._ENDPOINT}/getUniversityPagination?page=${page}&size=${size}`
        });
    }

    static async post(data) {
        return await Network.post({
            path: `${this._ENDPOINT}/newUniversity`,
            body: data
        });
    }

    static async put(id, data) {
        return await Network.put({
            path: `${this._ENDPOINT}/updateUniversity/${id}`,
            body: data
        });
    }

    static async delete(id) {
        return await Network.delete({
            path: `${this._ENDPOINT}/deleteUniversity/${id}`
        });
    }
}