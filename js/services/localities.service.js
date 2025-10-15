import { Network } from './../lib/network';

export class LocalitiesService {

    static _ENDPOINT = '/Locality';

    /**
     * Obtener localidades con paginación
     * @param {number} page 
     * @param {number} size 
     */
    static async getPaginated(page = 0, size = 10) {
        return await Network.get({
            path: `${this._ENDPOINT}/getLocalitiesPagination?page=${page}&size=${size}`
        });
    }

    /**
     * Crear una nueva localidad
     * @param {Object} data 
     * @param {string} data.universityID 
     * @param {boolean} data.isMainLocality 
     * @param {string} data.address 
     * @param {string} data.phoneNumber 
     */
    static async post(data) {
        return await Network.post({
            path: `${this._ENDPOINT}/newLocality`,
            body: data
        });
    }

    /**
     * Actualizar una localidad existente
     * @param {string} id
     * @param {Object} data 
     */
    static async put(id, data) {
        return await Network.put({
            path: `${this._ENDPOINT}/updateLocality/${id}`,
            body: data
        });
    }

    /**
     * Eliminar una localidad
     * @param {string} id 
     */
    static async delete(id) {
        return await Network.delete({
            path: `${this._ENDPOINT}/deleteLocation/${id}`
        });
    }
}