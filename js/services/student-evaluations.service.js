import { Network } from './../lib/network.js';

const BASE = '/api/StudentEvaluations';

export const StudentEvaluationsService = {
  async getAll() {
    // Espera 200 con lista o 204 sin contenido
    return await Network.get({ path: `${BASE}/getStudentEvaluations` });
  },

  async create(payload) {
    // Ajusta el DTO al esperado por tu backend:
    // title/description/date/topics/questionTypes → mapea en el controller si difieren
    return await Network.post({
      path: `${BASE}/insertStudentEvaluation`,
      body: payload
    });
  },

  async update(id, payload) {
    return await Network.put({
      path: `${BASE}/updateStudentEvaluation/${encodeURIComponent(id)}`,
      body: payload
    });
  },

  async remove(id) {
    return await Network.delete({
      path: `${BASE}/deleteStudentEvaluation/${encodeURIComponent(id)}`
    });
  }
};
