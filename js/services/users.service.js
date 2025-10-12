import { Network } from '../lib/network';

export class UsersService {

	static _ENDPOINT = '/Users';

	static async get(){
		return await Network.get({
			path: `${this._ENDPOINT}/getAllUsers`
		});
	}

	static async getByID(id){
		return await Network.get({
			path: `${this._ENDPOINT}/findUsersById/${id}`
		});
	}

	static async post(data){
		return await Network.post({
			path: `${this._ENDPOINT}/AddUser`,
			body: data
		});
	}

	static async put(id){
		return await Network.put({
			path: `${this._ENDPOINT}/UpdateUser/${id}`,
			body: data
		});
	}

	static async delete(id){
		return await Network.delete({
			path: `${this._ENDPOINT}/DeleteUser/${id}`
		});
	}

}