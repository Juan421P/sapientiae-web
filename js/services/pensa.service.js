import { Network } from '../lib/network.js';

export class PensumService {

    static _ENDPOINT = '/Pensum';
    static _CAREER_ENDPOINT = '/Careers';

    static async getPensumPagination(page = 0, size = 10) {
        return await Network.get({
            path: `${this._ENDPOINT}/getPensumPagination?page=${page}&size=${size}`
        });
    }

    static async getAllPensa() {
        return await Network.get({
            path: `${this._ENDPOINT}/getPensa`
        });
    }

    static async getAllCareers() {
        return await Network.get({
            path: `${this._CAREER_ENDPOINT}/getCareers`
        });
    }

    static async createPensum(data) {
        return await Network.post({
            path: `${this._ENDPOINT}/newPensum`,
            body: data
        });
    }

    static async updatePensum(id, data) {
        return await Network.put({
            path: `${this._ENDPOINT}/updatePensum/${id}`,
            body: data
        });
    }

    static async deletePensum(id) {
        return await Network.delete({
            path: `${this._ENDPOINT}/deletePensum/${id}`
        });
    }

}

export default PensumService;