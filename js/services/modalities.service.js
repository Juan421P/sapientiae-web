import { Network } from './../lib/network';

export class ModalitiesService {

    static _ENDPOINT = '/Modalities';

    static async get() {
        return await Network.get({
            path: `${this._ENDPOINT}/getModalities`
        });
    }

    static async getPagination(page = 0, size = 10) {
        return await Network.get({
            path: `${this._ENDPOINT}/getModalitiesPagination?page=${page}&size=${size}`
        });
    }

    static async post(data) {
        return await Network.post({
            path: `${this._ENDPOINT}/insertModality`,
            body: data
        });
    }

    static async put(id, data) {
        return await Network.put({
            path: `${this._ENDPOINT}/updateModalities/${id}`,
            body: data
        });
    }

    static async delete(id) {
        return await Network.delete({
            path: `${this._ENDPOINT}/deleteModality/${id}`
        });
    }
}