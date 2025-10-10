import { Service } from './../lib/service.js';
import { FacultyLocalitiesContract } from '../contracts/faculty-correlatives.contract.js'

export class FacultyCorrelativesService extends Service {
    
    static baseEndpoint = '/FacultyLocalities';
    static contract = new FacultyLocalitiesContract();

    static async list() {
        return await this.get('getFacultiesLocalitiesPagination', null, 'table');
    }

    static async create(facultyLocalitiesData) {
        return await this.post('AddFacultyLocality', facultyLocalitiesData, 'create');
    }

    static async update(facultyLocalitiesData) {
        return await this.put('UpdateFacultyLocality', facultyLocalitiesData, 'update');
    }

    static async delete(id) {
        return await this.delete('DeleteFacultyLocality', id);
    }
}
