import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { AcademicYearsContract } from './../contracts/academic-years.contract.js';

const ENDPOINT = '/AcademicYear';

export const AcademicYearsService = {
    contract: AcademicYearsContract,

    async list() {
        const academicYears = await fetchJSON(
            `${ENDPOINT}/getAcademicYear`
        );
        const parsed = Array.isArray(academicYears) ? academicYears.map(n => AcademicYearsContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('AcademicYears:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const academicYears = await postJSON(
            `${ENDPOINT}/insertAcademicYear`,
            AcademicYearsContract.parse(data, 'create')
        );
        const parsed = AcademicYearsContract.parse(academicYears, 'table');
        document.dispatchEvent(new CustomEvent('AcademicYears:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const academicYears = await putJSON(
            `${ENDPOINT}/updateAcademicYear/${data.academicYearId}`,
            AcademicYearsContract.parse(data, 'update')
        );
        const parsed = AcademicYearsContract.parse(academicYears, 'table');
        document.dispatchEvent(new CustomEvent('AcademicYears:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteAcademicYear/${id}`
        );
        document.dispatchEvent(new CustomEvent('AcademicYears:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};