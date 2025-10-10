import { fetchJSON, postJSON, putJSON, deleteJSON } from './../lib/network.js';
import { SubjectFamiliesContract } from './../contracts/subject-families.contract.js';

const ENDPOINT = '/SubjectFamilies';

export const SubjectFamiliesService = {
    contract: SubjectFamiliesContract,

    async list() {
        const families = await fetchJSON(
            `${ENDPOINT}/getSubjectFamilies`
        );
        const parsed = Array.isArray(families) ? families.map(f => SubjectFamiliesContract.parse(f, 'table')) : [];
        document.dispatchEvent(new CustomEvent('SubjectFamilies:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const family = await postJSON(
            `${ENDPOINT}/newSubjectFamily`,
            SubjectFamiliesContract.parse(data, 'create')
        );
        const parsed = SubjectFamiliesContract.parse(family, 'table');
        document.dispatchEvent(new CustomEvent('SubjectFamilies:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const family = await putJSON(
            `${ENDPOINT}/${data.subjectFamilyID}`,
            SubjectFamiliesContract.parse(data, 'update')
        );
        const parsed = SubjectFamiliesContract.parse(family, 'table');
        document.dispatchEvent(new CustomEvent('SubjectFamilies:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteSubjectFamily/${id}`
        );
        document.dispatchEvent(new CustomEvent('SubjectFamilies:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};
