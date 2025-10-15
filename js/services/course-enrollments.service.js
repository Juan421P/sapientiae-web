import { Network } from '../lib/network';

export class CourseEnrollmentsService {

	static _ENDPOINT = '/CourseEnrollments';

	static async get(){
		return await Network.get({
			path: `${this._ENDPOINT}/getCourseEnrollments`
		});
	}

	static async post(data){
		return await Network.post({
			path: `${this._ENDPOINT}/insertCourseEnrollment`,
			body: data
		});
	}

	static async put(id){
		return await Network.put({
			path: `${this._ENDPOINT}/updateCourseEnrollment/${id}`,
			body: data
		});
	}

	static async delete(id){
		return await Network.delete({
			path: `${this._ENDPOINT}/deleteCourseEnrollment/${id}`
		});
	}

}