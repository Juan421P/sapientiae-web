import { Service } from "./../lib/service.js";
import { DegreeTypeContract } from "../contracts/degree-types.contract.js";

export class DegreeTypeService extends Service {

    static baseEndpoint = '/DegreeTypes';
    static contract = new DegreeTypeContract();

    static async list() {
        return await this.get('getAllDegreeTypes', null, 'table');
    }

    static async create(degreeTypeData) {
        return await this.post('AddDegreeType', degreeTypeData, 'create');
    }

    static async update(degreeTypeData) {
        return await this.put('UpdateDegreeType', degreeTypeData, 'update');
    }

    static async delete(id) {
        return await this.delete('DeleteDegreeType', id);
    }
}