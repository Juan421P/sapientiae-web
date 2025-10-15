import { Network } from '../lib/network';

export class YearCyclesService {

    static _ENDPOINT = '/YearCycles';

    static async get(){
        return await Network.get({
            path: `${this._ENDPOINT}/getAllYearCycles`
        });
    }

    static async post(data){
        return await Network.post({
            path: `${this._ENDPOINT}/addYearCyle`,
            body: data
        });
    }

    static async put(id){
        return await Network.put({
            path: `${this._ENDPOINT}/UpdateYearCycle/${id}`,
            body: data
        });
    }

    static async delete(id){
        return await Network.delete({
            path: `${this._ENDPOINT}/DeleteYearCycle/${id}`
        });
    }

}