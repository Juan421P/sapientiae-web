import { Service } from "../lib/service.js";
import { SocialServiceContract } from "../contracts/social-service-projects.contract";

export class SocialServiceService extends Service {

    static baseEndpoint = '/SocialService';
    static contract = new SocialServiceContract();

    static async list() {
        return await this.get('getDataSocialService', null, 'table');
    }

    static async create(data) {
        return await this.postRaw('newSocialService', {
            "socialServiceProjectName": data.socialServiceProjectName,
            "description": data.description
        }, null);
    }

    static async update(data) {
        return await this.put('updateSocialService', data, 'update');
    }

    static async delete(id) {
        return await this.delete('deleteSocialService', id);
    }
}