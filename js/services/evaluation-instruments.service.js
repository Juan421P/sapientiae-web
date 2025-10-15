import { Network } from '../lib/network';

export class EvaluationInstrumentsService {

	static _ENDPOINT = '/EvaluationInstrument';

	static async get(){
		return await Network.get({
			path: `${this._ENDPOINT}/getEvaluationInstruments`
		});
	}

	static async post(data){
		return await Network.post({
			path: `${this._ENDPOINT}/insertEvaluationInstrument`,
			body: data
		});
	}

	static async put(id){
		return await Network.put({
			path: `${this._ENDPOINT}/updateEvaluationInstrument/${id}`,
			body: data
		});
	}

	static async delete(id){
		return await Network.delete({
			path: `${this._ENDPOINT}/deleteEvaluationInstrument/${id}`
		});
	}

}