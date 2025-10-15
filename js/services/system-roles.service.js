import { Network } from '../lib/network';

export class SystemRolesService {

    static _ENDPOINT = '/SystemRol';

    static async get(){
        return await Network.get({
            path: `${this._ENDPOINT}/getSystemRol`
        });
    }

    static async post(data){
        return await Network.post({
            path: `${this._ENDPOINT}/newSystemaRol`,
            body: data
        });
    }

    static async put(id){
        return await Network.put({
            path: `${this._ENDPOINT}/updateSystemRol/${id}`,
            body: data
        });
    }

    static async delete(id){
        return await Network.delete({
            path: `${this._ENDPOINT}/eliminarSystemRol/${id}`
        });
    }

}