import { Service } from "../lib/service.js";
import { StudentContract } from "../contracts/students.contract.js";

export class StudentService extends Service{
     
    static baseEndpoint = '/Students';
    static contract = new StudentContract();

    static async list() {
        return await this.get('getStudents', null, 'table');
    }

    static async create(data) {
        return await this.post('newStudent', data, 'create');
    }

    static async update(data) {
        return await this.put('updateStudents', data, 'update');
    }

    static async delete(id) {
        return await this.delete('deleteStudents', id);
    }
}