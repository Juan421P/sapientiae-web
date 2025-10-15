import { Network } from '../lib/network';

export class CourseOfferingsTeachersService {

    static _ENDPOINT = '/CourseOfferingsTeachers';

    static async get(){
        return await Network.get({
            path: `${this._ENDPOINT}/getAllCourseOfferingsTeachers`
        });
    }

    static async post(data){
        return await Network.post({
            path: `${this._ENDPOINT}/insertCourseOfferingTeacher`,
            body: data
        });
    }

    static async put(id){
        return await Network.put({
            path: `${this._ENDPOINT}/updateCourseOfferingTeacher/${id}`,
            body: data
        });
    }

    static async delete(id){
        return await Network.delete({
            path: `${this._ENDPOINT}/deleteCourseOfferingTeacher/${id}`
        });
    }

}