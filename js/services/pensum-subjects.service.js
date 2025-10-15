import { Network } from '../lib/network.js';

export class PensumService {
    static _ENDPOINT = '/Pensum';
    static _CAREERS_ENDPOINT = '/Careers';

    // Obtener todas las carreras para el select
    static async getAllCareers() {
        return await Network.get({
            path: `${this._CAREERS_ENDPOINT}/getCareers`
        });
    }

    // Obtener todos los pensum
    static async getAll() {
        return await Network.get({
            path: `${this._ENDPOINT}/getPensa`
        });
    }

    // Obtener pensum con paginación
    static async getPensumPagination(page = 0, size = 10) {
        return await Network.get({
            path: `${this._ENDPOINT}/getPensumPagination?page=${page}&size=${size}`
        });
    }

    // Crear nuevo pensum
    static async createPensum(data) {
        console.log('📤 POST /newPensum:', data);
        return await Network.post({
            path: `${this._ENDPOINT}/newPensum`,
            body: data
        });
    }

    // Actualizar pensum
    static async updatePensum(id, data) {
        console.log(`📤 PUT /updatePensum/${id}:`, data);
        return await Network.put({
            path: `${this._ENDPOINT}/updatePensum/${id}`,
            body: data
        });
    }

    // Eliminar pensum
    static async deletePensum(id) {
        console.log(`📤 DELETE /deletePensum/${id}`);
        return await Network.delete({
            path: `${this._ENDPOINT}/deletePensum/${id}`
        });
    }
}