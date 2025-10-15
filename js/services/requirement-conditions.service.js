import { Network } from '../lib/network';

export class RequirementConditionsService {

    static _ENDPOINT = '/RequirementConditions';

    static async get() {
        return await Network.get({
            path: `${this._ENDPOINT}/getRequirementCondition`
        });
    }

    static async post(data) {
        return await Network.post({
            path: `${this._ENDPOINT}/newRequirementCondition`,
            body: data
        });
    }

    static async put(id) {
        return await Network.put({
            path: `${this._ENDPOINT}/updateRequirementCondition/${id}`,
            body: data
        });
    }

    static async delete(id) {
        return await Network.delete({
            path: `${this._ENDPOINT}/deleteRequirementCondition/${id}`
        });
    }

}