import { Network } from '../lib/network';

export class DepartmentsService {

	static _ENDPOINT = '/Departments';

	static async get(){
		return await Network.get({
			path: `${this._ENDPOINT}/getDepartments`
		});
	}

	static async post(data){
		return await Network.post({
			path: `${this._ENDPOINT}/newDepartment`,
			body: data
		});
	}

	static async put(id){
		return await Network.put({
			path: `${this._ENDPOINT}/updateDepartment/${id}`,
			body: data
		});
	}

	static async delete(id){
		return await Network.delete({
			path: `${this._ENDPOINT}/deleteDepartment/${id}`
		});
	}

}