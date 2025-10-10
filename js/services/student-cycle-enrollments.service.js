import { Service } from './../lib/service.js';
import { StudentCycleEnrollmentsContract } from './../contracts/student-cycle-enrollments.contract.js';

export class StudentCycleEnrollmentsService extends Service {
  // Mantengo el patrón de tus otros servicios (sin /api aquí).
  static baseEndpoint = '/StudentCycleEnrollments';
  static contract = new StudentCycleEnrollmentsContract();

  // ===== MÉTODOS ESTÁTICOS =====

  // GET /StudentCycleEnrollments/getStudentCycleEnrollments
  static async list() {
    return super.get('getStudentCycleEnrollments', null, null, 'table');
  }

  // GET /StudentCycleEnrollments/getStudentCycleEnrollmentsPagination?page=&size=
  static async getPage(page = 0, size = 10) {
    const qs = `getStudentCycleEnrollmentsPagination?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`;
    // devolvemos raw o parsed? Si el backend devuelve Page<DTO>, lo normal es raw.
    // Si quieres parsear cada item a 'table', haz un map fuera.
    return super.get(qs);
  }

  // POST /StudentCycleEnrollments/insertStudentCycleEnrollment
  static async create(payload) {
    return super.post('insertStudentCycleEnrollment', payload, 'create', 'table');
  }

  // PUT /StudentCycleEnrollments/updateStudentCycleEnrollment/{id}
  static async update(id, payload) {
    const body = { ...(payload || {}), id }; // para consistencia con tu Service base (usa data?.id en _buildPath)
    return super.put('updateStudentCycleEnrollment', body, 'update', 'table');
  }

  // DELETE /StudentCycleEnrollments/deleteStudentCycleEnrollment/{id}
  static async remove(id) {
    return super.delete('deleteStudentCycleEnrollment', id);
  }

  // ===== WRAPPERS DE INSTANCIA (para componentes Display/Table) =====
  async list() { return this.constructor.getAll(); }
  async create(data) { return this.constructor.create(data); }
  async update(id, data) { return this.constructor.update(id, data); }
  async delete(id) { return this.constructor.remove(id); }
}
