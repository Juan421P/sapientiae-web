import { Network } from '../lib/network';

export class SubjectDefinitionsService {

    static _ENDPOINT = '/SubjectDefinitions';

    static async get() {
        return await Network.get({
            path: `${this._ENDPOINT}/getSubjectDefinition`
        });
    }

    static async post(data) {
        return await Network.post({
            path: `${this._ENDPOINT}/newSubjectDefinition`,
            body: data
        });
    }

    static async put(id) {
        return await Network.put({
            path: `${this._ENDPOINT}/updateSubjectDefinition/${id}`,
            body: data
        });
    }

    static async delete(id) {
        return await Network.delete({
            path: `${this._ENDPOINT}/deleteSubjectDefinition/${id}`
        });
    }

}