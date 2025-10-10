import { Service } from './../lib/service.js';
import { CourseEnrollmentContract } from './../contracts/course-enrollments.contract.js';

export class CourseEnrollmentService extends Service {
  // Igual que tus otros services: baseEndpoint SIN /api (lo agrega Network)
  static baseEndpoint = '/CourseEnrollments';
  static contract = new CourseEnrollmentContract();

  // ===== métodos estáticos =====

  // GET /CourseEnrollments/getCourseEnrollments
  static async list() {
    return super.get('getCourseEnrollments', null, null, 'table');
  }

  // GET /CourseEnrollments/getEnrollmentsPaginated?page=&size=
  // Este endpoint devuelve { status, data, currentPage, totalItems, totalPages }
  // Devolvemos la respuesta cruda para que manejes la paginación como prefieras.
  static async getPage(page = 0, size = 10) {
    const qs = `getEnrollmentsPaginated?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`;
    return super.get(qs);
  }

  // Si querés la data ya parseada al scope 'table', podés usar este helper opcional:
  static async getPageParsed(page = 0, size = 10) {
    const resp = await this.getPage(page, size);
    const parsed = Array.isArray(resp?.data)
      ? resp.data.map(item => this.contract.parse(item, 'table'))
      : [];
    return { ...resp, data: parsed };
  }

  // POST /CourseEnrollments/insertCourseEnrollment
  static async create(payload) {
    return super.post('insertCourseEnrollment', payload, 'create', 'table');
  }

  // PUT /CourseEnrollments/updateCourseEnrollment/{id}
  static async update(id, payload) {
    const body = { ...(payload || {}), id }; // nuestro Service.put arma /{id} con data?.id
    return super.put('updateCourseEnrollment', body, 'update', 'table');
  }

  // DELETE /CourseEnrollments/deleteCourseEnrollment/{id}
  static async remove(id) {
    return super.delete('deleteCourseEnrollment', id);
  }

  // ===== wrappers de instancia (útiles para Table/Display) =====
  async list() { return this.constructor.getAll(); }
  async create(data) { return this.constructor.create(data); }
  async update(id, data) { return this.constructor.update(id, data); }
  async delete(id) { return this.constructor.remove(id); }
}
