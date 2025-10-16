import { Network } from './../lib/network';

export class SubjectDefinitionsService {

    static _ENDPOINT = '/SubjectDefinitions';

    static async get() {
        return await Network.get({
            path: `${this._ENDPOINT}/getSubjectDefinition`
        });
    }

    static async getPagination(page = 0, size = 10) {
        return await Network.get({
            path: `${this._ENDPOINT}/getSubjectDefinitionPagination?page=${page}&size=${size}`
        });
    }

    static async post(data) {
        console.log('POST Request:', data);
        const response = await Network.post({
            path: `${this._ENDPOINT}/newSubjectDefinition`,
            body: data
        });
        console.log('POST Response:', response);
        return response;
    }

    static async put(id, data) {
        console.log('PUT Request:', { id, data });
        const response = await Network.put({
            path: `${this._ENDPOINT}/updateSubjectDefinition/${id}`,
            body: data
        });
        console.log('PUT Response:', response);
        return response;
    }

    static async delete(id) {
        console.log('DELETE Request:', id);
        const response = await Network.delete({
            path: `${this._ENDPOINT}/deleteSubjectDefinition/${id}`
        });
        console.log('DELETE Response:', response);
        return response;
    }
}