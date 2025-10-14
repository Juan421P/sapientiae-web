import { Network } from '../lib/network';

export class StudentCareerEnrollmentsService {

	static _ENDPOINT = '/StudentCareerEnrollments';

	static async get() {
		return await Network.get({
			path: `${this._ENDPOINT}/getAll`
		});
	}

	static async post(data) {
		return await Network.post({
			path: `${this._ENDPOINT}/insert`,
			body: data
		});
	}

	static async put(id) {
		return await Network.put({
			path: `${this._ENDPOINT}/update/${id}`,
			body: data
		});
	}

	static async delete(id) {
		return await Network.delete({
			path: `${this._ENDPOINT}/delete/${id}`
		});
	}

}