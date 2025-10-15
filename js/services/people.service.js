import { Network } from '../lib/network';

export class PeopleService {

	static _ENDPOINT = '/People';

	static async get(){
		return await Network.get({
			path: `${this._ENDPOINT}/getPeople`
		});
	}

	static async post(data){
		return await Network.post({
			path: `${this._ENDPOINT}/newPeople`,
			body: data
		});
	}

	static async put(id){
		return await Network.put({
			path: `${this._ENDPOINT}/updatePeople/${id}`,
			body: data
		});
	}

	static async delete(id){
		return await Network.delete({
			path: `${this._ENDPOINT}/deletePeople/${id}`
		});
	}

}