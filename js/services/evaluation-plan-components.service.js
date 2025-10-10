import { Service } from './../lib/service.js';
import { EvaluationPlanComponentsContract } from './../contracts/evaluation-plan-components.contract.js';

export class EvaluationPlanComponentsService extends Service {
  static baseEndpoint = '/EvaluationPlanComponents';
  static contract = new EvaluationPlanComponentsContract();

  // ===== estáticos =====

  // GET /EvaluationPlanComponents/getEvaluationPlanComponents
  static async list() {
    return super.get('getEvaluationPlanComponents', null, null, 'table');
  }

  // GET /EvaluationPlanComponents/getEvaluationPlanComponentsPagination?page=&size=
  static async getPage(page = 0, size = 10) {
    const qs = `getEvaluationPlanComponentsPagination?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`;
    // devuelve Page cruda; si quieres, luego mapeas content a 'table'
    return super.get(qs);
  }

  // POST /EvaluationPlanComponents/newEvaluationPlanComponents
  static async create(payload) {
    return super.post('newEvaluationPlanComponents', payload, 'create', 'table');
  }

  // PUT /EvaluationPlanComponents/uploadEvaluationPlanComponents/{id}
  static async update(id, payload) {
    const body = { ...(payload || {}), id }; // nuestro Service.put arma /{id} desde data?.id
    return super.put('uploadEvaluationPlanComponents', body, 'update', 'table');
  }

  // DELETE /EvaluationPlanComponents/deleteEvaluationPlanComponents/{id}
  static async remove(id) {
    return super.delete('deleteEvaluationPlanComponents', id);
  }

  // ===== wrappers de instancia =====
  async list() { return this.constructor.getAll(); }
  async create(data) { return this.constructor.create(data); }
  async update(id, data) { return this.constructor.update(id, data); }
  async delete(id) { return this.constructor.remove(id); }
}
