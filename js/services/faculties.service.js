import { Service } from './../lib/service.js';
import { FacultiesContract } from './../contracts/faculties.contract.js';

export class FacultiesService extends Service {
    
    static baseEndpoint = '/Faculties';
    static contract = new FacultiesContract();

    static async list() {
        return await this.get('getFacultiesPagination', null, 'table');
    }

    static async create(facultyData) {
        return await this.post('newFaculties', facultyData, 'create');
    }

    static async update(facultyData) {
        return await this.put('updateFaculty', facultyData, 'update');
    }

    static async delete(id) {
        return await this.delete('deleteFaculty', id);
    }
}