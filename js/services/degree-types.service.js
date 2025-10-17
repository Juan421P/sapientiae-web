import { Network } from '../lib/network';

export class DegreeTypesService {

	static _ENDPOINT = '/DegreeTypes';

	static async get(){
		return await Network.get({
			path: `${this._ENDPOINT}/getAllDegreeTypes`
		});
	}

	static async post(data){
		return await Network.post({
			path: `${this._ENDPOINT}/AddDegreeType`,
			body: data
		});
	}

	static async put(id, data){
		return await Network.put({
			path: `${this._ENDPOINT}/UpdateDegreeType/${id}`,
			body: data
		});
	}

	static async delete(id){
		return await Network.delete({
			path: `${this._ENDPOINT}/DeleteDegreeType/${id}`
		});
	}

}