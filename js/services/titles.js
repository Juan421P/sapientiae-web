import { Network } from './../lib/network';

export class DegreeTypesService {

    static _ENDPOINT = '/DegreeTypes';

    /**
     * Obtener tipos de título con paginación
     * @param {number} page
     * @param {number} size 
     */
    static async getPaginated(page = 0, size = 10) {
        return await Network.get({
            path: `${this._ENDPOINT}/getALlDegreeTypesPagination?page=${page}&size=${size}`
        });
    }

    /**
     * Crear un nuevo tipo de título
     * @param {Object} data - Datos del tipo de título
     * @param {string} data.universityID
     * @param {string} data.degreeTypeName
     */
    static async post(data) {
        return await Network.post({
            path: `${this._ENDPOINT}/AddDegreeType`,
            body: data
        });
    }

    /**
     * Actualizar un tipo de título existente
     * @param {string} id
     * @param {Object} data
     */
    static async put(id, data) {
        return await Network.put({
            path: `${this._ENDPOINT}/UpdateDegreeType/${id}`,
            body: data
        });
    }

    /**
     * Eliminar un tipo de título
     * @param {string} id 
     */
    static async delete(id) {
        return await Network.delete({
            path: `${this._ENDPOINT}/DeleteDegreeType/${id}`
        });
    }
}