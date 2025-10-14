import { Network } from '../lib/network';

export class PensaService {

    static _ENDPOINT = '/Pensum';

    static async get() {
        return await Network.get({
            path: `${this._ENDPOINT}/getPensa`
        });
    }

    static async post(data) {
        return await Network.post({
            path: `${this._ENDPOINT}/newPensum`,
            body: data
        });
    }

    static async put(id) {
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