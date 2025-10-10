import { Service } from './../lib/service.js';
import { FacultyCorrelativeContract } from '../contracts/faculty-correlatives.contract.js'

export class FacultyCorrelativesService extends Service {
    
    static baseEndpoint = '/FacultyCorrelative';
    static contract = new FacultyCorrelativeContract();

    static async list() {
        return await this.get('getFacultiesCorrelativesPagination', null, 'table');
    }

    static async create(facultyCorrelativeData) {
        return await this.post('newFacultyCorrelatives', facultyCorrelativeData, 'create');
    }

    static async update(facultyCorrelativeData) {
        return await this.put('updateFacultyCorrelatives', facultyCorrelativeData, 'update');
    }

    static async delete(id) {
        return await this.delete('deleteFacultyCorrelatives', id);
    }
}
