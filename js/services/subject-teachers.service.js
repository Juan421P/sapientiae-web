import { fetchJSON, postJSON, putJSON, deleteJSON } from './../lib/network.js';
import { SubjectTeachersContract } from './../contracts/subjectTeachers.contract.js';

const ENDPOINT = '/SubjectTeachers';

export const SubjectTeachersService = {
    contract: SubjectTeachersContract,

    async list() {
        const subjectTeachers = await fetchJSON(
            `${ENDPOINT}/getSubjectTeachers`
        );
        const parsed = Array.isArray(subjectTeachers) ? subjectTeachers.map(st => SubjectTeachersContract.parse(st, 'table')) : [];
        document.dispatchEvent(new CustomEvent('SubjectTeachers:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const subjectTeacher = await postJSON(
            `${ENDPOINT}/newSubjectTeacher`,
            SubjectTeachersContract.parse(data, 'create')
        );
        const parsed = SubjectTeachersContract.parse(subjectTeacher, 'table');
        document.dispatchEvent(new CustomEvent('SubjectTeachers:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const subjectTeacher = await putJSON(
            `${ENDPOINT}/${data.subjectTeacherID}`,
            SubjectTeachersContract.parse(data, 'update')
        );
        const parsed = SubjectTeachersContract.parse(subjectTeacher, 'table');
        document.dispatchEvent(new CustomEvent('SubjectTeachers:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteSubjectTeacher/${id}`
        );
        document.dispatchEvent(new CustomEvent('SubjectTeachers:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};
