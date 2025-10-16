import { Network } from './../lib/network.js';

const BASE = '/EvaluationPlans';

export class EvaluationPlansService {
  static async getAll() {
    return await Network.get({
       path: `${BASE}/getEvaluationPlan` 
      });
  }
  static async create(payload) {
    return await Network.post({
       path: `${BASE}/insertEvaluationPlan`,
        body: payload 
      });
  }
  static async update(id, payload) {
    return await Network.put({
       path: `${BASE}/updateEvaluationPlan/${id}`,
        body: payload 
      });
  }
  static async delete(id) {
    return await Network.delete({
       path: `${BASE}/deleteEvaluationPlan/${id}` 
      });
  }
}

