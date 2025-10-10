import { Service } from './../lib/service.js';
import { UniversityContract } from '../contracts/universities.contract.js'

export class UniversitiesService extends Service {

    static baseEndpoint = '/University';
    static contract = new UniversityContract();

    static async list() {
        return await this.get('getDataUniversity', null, 'table');
    }

    static async create(data) {
        return await this.post('newUniversity', data, 'create');
    }

    static async update(data) {
        return await this.put('updateUniversity', data, 'update');
    }

    static async delete(id) {
        return await this.delete('deleteUniversity', id);
    }
}