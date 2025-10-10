import { Service } from './../lib/service.js';
import { SubjectDefinitionsContract } from './../contracts/subject-definitions.contract.js';

export class SubjectDefinitionsService extends Service {

    static baseEndpoint = '/SubjectsDefinition';
    static contract = new SubjectDefinitionsContract();

    static async list() {
        return await this.get('', null, null, 'default');
    }

    static async create(data) {
        return await this.post('', data, 'default');
    }

    static async update(subjectID, data) {
        return await this.put(`${subjectID}`, data, 'default');
    }

    static async delete(subjectID) {
        return await this.delete(`${subjectID}`);
    }
}
