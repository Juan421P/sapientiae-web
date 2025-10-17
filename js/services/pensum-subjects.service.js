// Service para Modalities
import { Network } from '../lib/network.js';

class PensumSubjectsService {

    static _ENDPOINT = '/PensumSubjects';

    static async get() {
        return await Network.get({
            path: `${this._ENDPOINT}/getPenumSubjects`
        });
    }

    static async post(data) {
        return await Network.post({
            path: `${this._ENDPOINT}/insertPensumSubject`,
            body: data
        });
    }

    static async put(id) {
        return await Network.put({
            path: `${this._ENDPOINT}/updatePensumSubject/${id}`,
            body: data
        });
    }

    static async delete(id) {
        return await Network.delete({
            path: `${this._ENDPOINT}/deletePensumSubject/${id}`
        });
    }
}