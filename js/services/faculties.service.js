import { Network } from '../lib/network';

export class FacultiesService {

	static _ENDPOINT = '/Faculties';

	static async get(){
		return await Network.get({
			path: `${this._ENDPOINT}/getFaculties`
		});
	}

	static async post(data){
		return await Network.post({
			path: `${this._ENDPOINT}/newFaculties`,
			body: data
		});
	}

	static async put(id){
		return await Network.put({
			path: `${this._ENDPOINT}/updateFaculty/${id}`,
			body: data
		});
	}

	static async delete(id){
		return await Network.delete({
			path: `${this._ENDPOINT}/deleteFaculty/${id}`
		});
	}

}