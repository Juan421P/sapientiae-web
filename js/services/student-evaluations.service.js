import { Network } from './../lib/network.js';

const BASE = '/StudentEvaluations';

export const StudentEvaluationsService = {
  async getAll() {
    // Espera 200 con lista o 204 sin contenido
    return await Network.get({ path: `${BASE}/GetAllStudentsEvaluations` });
  },

  async create(payload) {
    return await Network.post({
      path: `${BASE}/AddtudentEvaluation`,
      body: payload
    });
  },

  async update(id, payload) {
    return await Network.put({
      path: `${BASE}/UpdateStudentEvaluation/${(id)}`,
      body: payload
    });
  },

  async remove(id) {
    return await Network.delete({
      path: `${BASE}/DeleteStudentEvaluation/${(id)}`
    });
  }
};
