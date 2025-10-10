import { Service } from './../lib/service.js';
import { CyclicStudentPerformanceContract } from './../contracts/cyclic-student-performances.contract.js';

export class CyclicStudentPerformanceService extends Service {
  // Igual que tus otros services: sin /api aquí (tu Network lo agrega).
  static baseEndpoint = '/CyclicStudentPerformance';
  static contract = new CyclicStudentPerformanceContract();

  // ===== estáticos =====

  // GET /CyclicStudentPerformance/getPerformances
  static async list() {
    return super.get('getPerformances', null, null, 'table');
  }

  // GET /CyclicStudentPerformance/getPerformancesPagination?page=&size=
  static async getPage(page = 0, size = 10) {
    const qs = `getPerformancesPagination?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`;
    // Devolvemos la Page cruda (tal como viene). Si luego quieres mapear content[] a 'table', lo hacemos aparte.
    return super.get(qs);
  }

  // POST /CyclicStudentPerformance/insertPerformance
  static async create(payload) {
    return super.post('insertPerformance', payload, 'create', 'table');
  }

  // PUT /CyclicStudentPerformance/updatePerformance/{id}
  static async update(id, payload) {
    const body = { ...(payload || {}), id }; // tu Service.put arma /{id} desde data?.id
    return super.put('updatePerformance', body, 'update', 'table');
  }

  // DELETE /CyclicStudentPerformance/deletePerformance/{id}
  static async remove(id) {
    return super.delete('deletePerformance', id);
  }

  // ===== wrappers de instancia (útiles para Display/Table) =====
  async list() { return this.constructor.getAll(); }
  async create(data) { return this.constructor.create(data); }
  async update(id, data) { return this.constructor.update(id, data); }
  async delete(id) { return this.constructor.remove(id); }
}
