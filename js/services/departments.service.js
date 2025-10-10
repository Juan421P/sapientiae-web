import { Service } from './../lib/service.js';
import { DepartmentsContract } from './../contracts/departments.contract.js';

export class DepartmentsService extends Service {
    
    static baseEndpoint = '/Departments';
    static contract = new DepartmentsContract();

    static async list() {
        return await this.get('getDepartmentsPagination', null, 'table');
    }

    static async create(departmentData) {
        return await this.post('newDepartment', departmentData, 'create');
    }

    static async update(departmentData) {
        return await this.put('updateDepartment', departmentData, 'update');
    }

    static async delete(id) {
        return await this.delete('deleteDeparmentn', id);
    }
}