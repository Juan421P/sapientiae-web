import { Service } from './../lib/service.js';
import { StudentCareerEnrollmentsContract } from './../contracts/student-career-enrollments.contract.js';

export class StudentCareerEnrollmentsService extends Service {
  static baseEndpoint = '/StudentCareerEnrollments';
  static contract = new StudentCareerEnrollmentsContract();

  // Estáticos (útiles para llamadas directas)
  static async list() {
    // GET /StudentCareerEnrollments/getAllEnrollments
    return super.get('getAllEnrollments', null, null, 'table');
  }

  static async create(payload) {
    // POST /StudentCareerEnrollments/insertEnrollment
    return super.post('insertEnrollment', payload, 'create', 'table');
  }

  static async update(id, payload) {
    // PUT /StudentCareerEnrollments/updateEnrollment/{id}
    const body = { ...(payload || {}), id };
    return super.put('updateEnrollment', body, 'update', 'table');
  }

  static async remove(id) {
    // DELETE /StudentCareerEnrollments/deleteEnrollment/{id}
    return super.delete('deleteEnrollment', id);
  }

  // Wrappers de instancia (para componentes)
  async list()   { return this.constructor.getAll(); }
  async create(data) { return this.constructor.create(data); }
  async update(id, data) { return this.constructor.update(id, data); }
  async delete(id) { return this.constructor.remove(id); }
}
