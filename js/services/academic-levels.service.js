import { Service } from "../lib/service.js";
import { AcademicLevelsContract } from "../contracts/academic-levels.contract.js";

export class AcademicLevelService extends Service{

    static baseEndpoint = '/AcademicLevels';
    static contract = new AcademicLevelsContract();

    static async list() {
        return await this.get('getAcademicLevels', null, 'table');
    }

    static async create(academicLevelData) {
        return await this.post('insertAcademicLevel', academicLevelData, 'create');
    }

    static async update(academicLevelData) {
        return await this.put('updateAcademicLevel', academicLevelData, 'update');
    }

    static async delete(id) {
        return await this.delete('deleteAcademicLevel', id);
    }
}