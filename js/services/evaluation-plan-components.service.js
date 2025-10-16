import { Network } from './../lib/network.js';

const BASE = '/EvaluationPlanComponents';

export class EvaluationPlanComponentsService {
  static async getAll() {
    return await Network.get({
       path: `${BASE}/getEvaluationPlanComponents`
      });
  }
  static async create(payload) {
    return await Network.post({
       path: `${BASE}/newEvaluationPlanComponents`,
       body: payload 
      });
  }
  static async update(id, payload) {
    return await Network.put({
       path: `${BASE}/uploadEvaluationPlanComponents/${id}`,
       body: payload 
      });
  }
  static async delete(id) {
    return await Network.delete({
      path: `${BASE}/deleteEvaluationPlanComponents/${id}`
    });
  }
}
