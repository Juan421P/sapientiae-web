import { Service } from './../lib/service.js';
import { PensaContract } from "../contracts/pensa.contract";

export class PensaService extends Service {
    
    static baseEndpoint = '/Pensum';
    static contract = new PensaContract();

    static async list() {
        return await this.get('getPensumPagination', null, 'table');
    }

    static async create(data) {
        return await this.post('newPensum', data, 'create');
    }

    static async update(data) {
        return await this.put('updatePensum', data, 'update');
    }

    static async delete(id) {
        return await this.delete('deletePensum', id);
    }
}
