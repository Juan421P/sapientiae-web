// js/services/employees.service.js
import { Service } from "../lib/service.js";
import { EmployeesContract } from "../contracts/employees.contract.js";

export class EmployeesService extends Service {
  static baseEndpoint = '/Employees';
  static contract = new EmployeesContract();

  // GET /Employees/getEmployees
  static async list() {
    return super.get('getEmployees', null, null, 'table');
  }

  // POST /Employees/insertEmployee
  static async create(payload) {
    return super.post('insertEmployee', payload, 'create', 'table');
  }

  // PUT /Employees/updateEmployee/{id}
  static async update(id, payload) {
    const body = { ...(payload || {}), id }; // nuestro Service.put arma /{id} con data?.id
    return super.put('updateEmployee', body, 'update', 'table');
  }

  // DELETE /Employees/deleteEmployee/{id}
  static async remove(id) {
    return super.delete('deleteEmployee', id);
  }

  // Wrappers de instancia (para componentes)
  async list() { return this.constructor.getAll(); }
  async create(data) { return this.constructor.create(data); }
  async update(id, data) { return this.constructor.update(id, data); }
  async delete(id) { return this.constructor.remove(id); }
}
