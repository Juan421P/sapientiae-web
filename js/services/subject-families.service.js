// subject-families.service.js
import { Network } from '../lib/network';

export class SubjectFamiliesService {

    static _ENDPOINT = '/SubjectFamilies';

    static async get() {
        return await Network.get({
            path: `${this._ENDPOINT}/getSubjectFamilies`
        });
    }

    static async post(data) {
        return await Network.post({
            path: `${this._ENDPOINT}/newSubjectFamily`,
            body: data
        });
    }

    static async put(id, data) {
        return await Network.put({
            path: `${this._ENDPOINT}/updateSubjectFamily/${id}`,
            body: data
        });
    }

    static async delete(id) {
        return await Network.delete({
            path: `${this._ENDPOINT}/deleteSubjectFamily/${id}`
        });
    }
}