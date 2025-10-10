// services/course-offerings.service.js
import { Service } from './../lib/service.js';
import { CourseOfferingsContract } from './../contracts/course-offerings.contract.js';

export class CourseOfferingsService extends Service {
  // SIN /api (lo agrega tu Network)
  static baseEndpoint = '/CourseOfferings';
  static contract = new CourseOfferingsContract();

  // ===== estáticos =====
  // GET /CourseOfferings/getAllCourseOfferings
  static async list() {
    return super.get('getAllCourseOfferings', null, null, 'table');
  }

  // POST /CourseOfferings/insertCourseOffering
  static async create(payload) {
    return super.post('insertCourseOffering', payload, 'create', 'table');
  }

  // PUT /CourseOfferings/updateCourseOffering/{id}
  static async update(id, payload) {
    const body = { ...(payload || {}), id }; // Service._buildPath usa data?.id
    return super.put('updateCourseOffering', body, 'update', 'table');
  }

  // DELETE /CourseOfferings/deleteCourseOffering/{id}
  static async remove(id) {
    return super.delete('deleteCourseOffering', id);
  }

  // ===== wrappers de instancia (útiles para componentes) =====
  async list() { return this.constructor.getAll(); }
  async create(data) { return this.constructor.create(data); }
  async update(id, data) { return this.constructor.update(id, data); }
  async delete(id) { return this.constructor.remove(id); }
}
