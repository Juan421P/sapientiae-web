import { Network } from '../lib/network';

export class CourseOfferingService {

    static _ENDPOINT = '/CourseOfferings';

    static async get(){
        return await Network.get({
            path: `${this._ENDPOINT}/getAllCourseOfferings`
        });
    }

    static async post(data){
        return await Network.post({
            path: `${this._ENDPOINT}/insertCourseOffering`,
            body: data
        });
    }

    static async put(id){
        return await Network.put({
            path: `${this._ENDPOINT}/updateCourseOffering/${id}`,
            body: data
        });
    }

    static async delete(id){
        return await Network.delete({
            path: `${this._ENDPOINT}/deleteCourseOffering/${id}`
        });
    }

}