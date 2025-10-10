import { fetchJSON,postJSON,putJSON, deleteJSON } from "../lib/network";
import { PensumSubjectsContract } from "../contracts/pensum-subjects.contract";

const ENDPOINT = '/PensumSubjects'

export const PensumSubjectService = {
    contract: PensumSubjectsContract,

    async list(){
        const pensumSubject = await fetchJSON(
            `${ENDPOINT}/getPenumSubjects`
        );
        const parsed = Array.isArray(pensumSubject) ? pensumSubject.map(n => PensumSubjectsContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('PensumSubjects:list', {
            detail: parsed
        }));
        return parsed
    },

    async create(data){
        const pensumSubject = await postJSON(
            `${ENDPOINT}/insertPensumSubject`,
            PensumSubjectsContract.parse(data, 'create')
        );
        const parsed = PensumSubjectsContract.parse(pensumSubject, 'table');
        document.dispatchEvent(new CustomEvent('PensumSubjects:create', {
            detial: parsed
        }));
        return parsed;
    },

    async update(data){
        const pensumSubject = await putJSON(
            `${ENDPOINT}/${data.pensumSubjectID}`,
            PensumSubjectsContract.parse(data, 'update')
        );
        const parsed = PensumSubjectsContract.parse(pensumSubject, 'table');
        document.dispatchEvent(new CustomEvent('PensumSubjects:update', { detail:parsed}));
        return parsed;
    },

    async delete(id){
        const success = await deleteJSON(
            `${ENDPOINT}/deletePensumSubject/${id}`
        );
        document.dispatchEvent(new CustomEvent('PensumSubjects:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
}