import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { studentEvaluationContract } from '../contracts/student-evaluations.contract.js';

const ENDPOINT = '/studentEvaluations';

export const studentEvaluationService ={
    contract: studentEvaluationContract,
    
    async list(){
        const studentEvaluations = await fetchJSON(
            `${ENDPOINT}/getStudentEvaluations`
        )
        const parsed = Array.isArray(studentEvaluations) ? studentEvaluations.map(n => studentEvaluations.parse(n, 'table')) : [];
                document.dispatchEvent(new CustomEvent('studentEvaluations:list', {
                    detail: parsed
                }));
                return parsed;
    },

    async create(data){
         const studentEvaluations = await postJSON(
                    `${ENDPOINT}/newStudentEvaluation`,
                    studentEvaluations.parse(data, 'create')
                );
                const parsed = studentEvaluations.parse(studentEvaluations, 'table');
                document.dispatchEvent(new CustomEvent('studentEvaluations:create', {
                    detail: parsed
                }));
                return parsed;
    },

     async update(data) {
            const studentEvaluations = await putJSON(
                `${ENDPOINT}/${data.studentEvaluationID}`,
                studentEvaluations.parse(data, 'update')
            );
            const parsed = studentEvaluations.parse(s, 'table');
            document.dispatchEvent(new CustomEvent('studentEvaluations:update', { detail: parsed }));
            return parsed;
        },

        async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteStudentEvaluation/${id}`
        );
        document.dispatchEvent(new CustomEvent('studentEvaluations:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
    
}