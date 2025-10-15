import { Network } from './../lib/network';

export class CareersService {

    static _ENDPOINT = '/Careers';

    static async get() {
        return await Network.get({
            path: `${this._ENDPOINT}/getCareers`
        });
    }

    static async post(data) {
        return await Network.post({
            path: `${this._ENDPOINT}/insertCareer`,
            body: data
        });
    }

    static async put(id) {
        return await Network.put({
            path: `${this._ENDPOINT}/updateCareer/${id}`,
            body: data
        });
    }

    static async delete(id) {
        return await Network.delete({
            path: `${this._ENDPOINT}/deleteCareer/${id}`
        });
    }
}