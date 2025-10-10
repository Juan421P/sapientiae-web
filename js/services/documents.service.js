import { Service } from "../lib/service.js";
import { DocumentsContract } from "../contracts/documents.contract.js";

export class DocumentsService extends Service{

    static baseEndpoint = '/Documents';
    static contract = new DocumentsContract();

    static async list() {
        return await this.get('getDocuments', null, 'table');
    }

    static async create(documentData) {
        return await this.post('insertDocument', documentData, 'create');
    }

    static async update(documentData) {
        return await this.put('updateDocument', documentData, 'update');
    }

    static async delete(id) {
        return await this.delete('deleteDocument', id);
    }
}