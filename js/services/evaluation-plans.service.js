import { Service } from './../lib/service.js';
import { EvaluationPlansContract } from './../contracts/evaluation-plans.contract.js';

export class EvaluationPlansService extends Service {
  // Igual que el resto: sin /api (lo añade tu Network)
  static baseEndpoint = '/EvaluationPlans';
  static contract = new EvaluationPlansContract();

  // ===== métodos estáticos =====

  // GET /EvaluationPlans/getEvaluationPlan
  static async list() {
    return super.get('getEvaluationPlan', null, null, 'table');
  }

  // GET /EvaluationPlans/getEvaluationPlansPagination?page=&size=
  static async getPage(page = 0, size = 10) {
    const qs = `getEvaluationPlansPagination?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`;
    // devolvemos el Page crudo
    return super.get(qs);
  }

  // POST /EvaluationPlans/insertEvaluationPlan
  static async create(payload) {
    return super.post('insertEvaluationPlan', payload, 'create', 'table');
  }

  // PUT /EvaluationPlans/updateEvaluationPlan/{id}
  static async update(id, payload) {
    const body = { ...(payload || {}), id }; // el Service base usa data?.id para /{id}
    return super.put('updateEvaluationPlan', body, 'update', 'table');
  }

  // DELETE /EvaluationPlans/deleteEvaluationPlan/{id}
  static async remove(id) {
    return super.delete('deleteEvaluationPlan', id);
  }

  // ===== wrappers de instancia (para componentes) =====
  async list() { return this.constructor.getAll(); }
  async create(data) { return this.constructor.create(data); }
  async update(id, data) { return this.constructor.update(id, data); }
  async delete(id) { return this.constructor.remove(id); }
}
