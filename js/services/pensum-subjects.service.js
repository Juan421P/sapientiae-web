// Service para Modalities
import { Network } from '../lib/network.js';

class ModalitiesService {
    static _ENDPOINT = '/Modalities';

    static async getModalitiesPagination(page = 0, size = 10) {
        return await Network.get({
            path: `${this._ENDPOINT}/getModalitiesPagination?page=${page}&size=${size}`
        });
    }

    static async getAllModalities() {
        return await Network.get({
            path: `${this._ENDPOINT}/getModalities`
        });
    }

    static async createModality(modalityData) {
        console.log('📤 POST /insertModality:', modalityData);
        return await Network.post({
            path: `${this._ENDPOINT}/insertModality`,
            body: modalityData
        });
    }

    static async updateModality(id, modalityData) {
        console.log(`📤 PUT /updateModalities/${id}:`, modalityData);
        return await Network.put({
            path: `${this._ENDPOINT}/updateModalities/${id}`,
            body: modalityData
        });
    }

    static async deleteModality(id) {
        console.log(`📤 DELETE /deleteModality/${id}`);
        return await Network.delete({
            path: `${this._ENDPOINT}/deleteModality/${id}`
        });
    }
}

export default ModalitiesService;