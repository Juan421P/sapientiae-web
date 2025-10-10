import { Service } from './../lib/service.js';
import { CareersContract } from './../contracts/careers.contract.js';

export class CareersService extends Service {
    
    static baseEndpoint = '/Careers';
    static contract = new CareersContract();

    static async list() {
        return await this.get('getCareersPaginated', null, 'table');
    }

    static async create(data) {
        return await this.post('insertCareer', data, 'create');
    }

    static async update(data) {
        return await this.put('updateCareer', data, 'update');
    }

    static async delete(id) {
        return await this.delete('deleteCareer', id);
    }
}