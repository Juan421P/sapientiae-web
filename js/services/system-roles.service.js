import { Service } from './../lib/service.js';
import { SystemRolesContract } from '../contracts/system-roles.contract.js'

export class SystemRolesService extends Service {
    
    static baseEndpoint = '/SystemRol';
    static contract = new SystemRolesContract();

    static async list() {
        return await this.get('getSystemRol', null, 'table');
    }

    static async create(data) {
        return await this.post('newSystemaRol', data, 'create');
    }

    static async update(data) {
        return await this.put('updateSystemRol', data, 'update');
    }

    static async delete(id) {
        return await this.delete('eliminarSystemRol', id);
    }
}