import { Network } from '../lib/network';

export class StudentsService {

    static _ENDPOINT = '/Students';

    static async get() {
        return await Network.get({
            path: `${this._ENDPOINT}/getStudents`
        });
    }

    static async post(data) {
        return await Network.post({
            path: `${this._ENDPOINT}/newStudent`,
            body: data
        });
    }

    static async put(id) {
        return await Network.put({
            path: `${this._ENDPOINT}/updateStudents/${id}`,
            body: data
        });
    }

    static async delete(id) {
        return await Network.delete({
            path: `${this._ENDPOINT}/deleteStudents/${id}`
        });
    }

}