import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { studentDocumentsContract } from '../contracts/student-documents.contract.js';

const ENDPOINT = '/studentDocuments';

export const studentDocumentsService ={
    contract: studentDocumentsContract,
    
    async list(){
        const studentDocuments = await fetchJSON(
            `${ENDPOINT}/getStudentDocuments`
        )
        const parsed = Array.isArray(studentDocuments) ? studentDocuments.map(n => studentDocuments.parse(n, 'table')) : [];
                document.dispatchEvent(new CustomEvent('studentDocuments:list', {
                    detail: parsed
                }));
                return parsed;
    },

    async create(data){
         const studentDocuments = await postJSON(
                    `${ENDPOINT}/newStudentDocument`,
                    studentDocuments.parse(data, 'create')
                );
                const parsed = studentDocuments.parse(studentDocuments, 'table');
                document.dispatchEvent(new CustomEvent('studentDocuments:create', {
                    detail: parsed
                }));
                return parsed;
    },

     async update(data) {
            const studentDocuments = await putJSON(
                `${ENDPOINT}/${data.studentDocumentID}`,
                studentDocuments.parse(data, 'update')
            );
            const parsed = studentDocuments.parse(s, 'table');
            document.dispatchEvent(new CustomEvent('studentDocuments:update', { detail: parsed }));
            return parsed;
        },

        async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteStudentDocument/${id}`
        );
        document.dispatchEvent(new CustomEvent('studentDocuments:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
    
}