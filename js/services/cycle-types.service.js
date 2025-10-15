import { Network } from '../lib/network';

export class CycleTypesService {

	static _ENDPOINT = '/CycleTypes';

	static async get(){
		return await Network.get({
			path: `${this._ENDPOINT}/getAllCycleTypes`
		});
	}

	static async post(data){
		return await Network.post({
			path: `${this._ENDPOINT}/AddCycleType`,
			body: data
		});
	}

	static async put(id){
		return await Network.put({
			path: `${this._ENDPOINT}/UpdateCycleType/${id}`,
			body: data
		});
	}

	static async delete(id){
		return await Network.delete({
			path: `${this._ENDPOINT}/DeleteCycleType/${id}`
		});
	}

}