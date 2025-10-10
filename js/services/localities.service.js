import { Service } from './../lib/service.js';
import { LocalitiesContract } from '../contracts/localities.contract.js'

export class LocalitiesService extends Service {
    
    static baseEndpoint = '/Locality';
    static contract = new LocalitiesContract();

    static async list() {
        return await this.get('getLocalitiesPagination', null, 'table');
    }

    static async create(localityData) {
        return await this.post('newLocality', localityData, 'create');
    }

    static async update(localityData) {
        return await this.put('updateLocality', localityData, 'update');
    }

    static async delete(id) {
        return await this.delete('deleteLocation', id);
    }

}