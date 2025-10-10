import { Service } from "../lib/service.js";
import { EvaluationInstrumentsContract } from "../contracts/evaluation-instruments.contract.js";

export class EvaluationInstrumentsService extends Service{
    
    static baseEndpoint = '/EvaluationInstrument';
    static contract = new EvaluationInstrumentsContract();

    static async list() {
        return await this.get('getEvaluationInstruments', null, 'table');
    }

    static async create(evaluationInstrumentData) {
        return await this.post('insertEvaluationInstrument', evaluationInstrumentData, 'create');
    }

    static async update(evaluationInstrumentData) {
        return await this.put('updateEvaluationInstrument', evaluationInstrumentData, 'update');
    }

    static async delete(id) {
        return await this.delete('deleteEvaluationInstrument', id);
    }
}
