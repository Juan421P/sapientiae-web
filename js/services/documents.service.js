import { Network } from '../lib/network';

export class DocumentsService {

	static _ENDPOINT = '/Documents';

	static async get(){
		return await Network.get({
			path: `${this._ENDPOINT}/getDocuments`
		});
	}

	static async post(data){
		return await Network.post({
			path: `${this._ENDPOINT}/insertDocument`,
			body: data
		});
	}

	static async put(id){
		return await Network.put({
			path: `${this._ENDPOINT}/updateDocument/${id}`,
			body: data
		});
	}

	static async delete(id){
		return await Network.delete({
			path: `${this._ENDPOINT}/deleteDocument/${id}`
		});
	}

}