import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { CarrerCycleAvailabilityContract } from './../contracts/career-cycle-availability.contract.js';

const ENDPOINT = '/CareerCycleAvailability';

export const CareerCycleAvailabilitiesService = {
    contract: CarrerCycleAvailabilityContract,

    async list() {
        const carrerCycleAvailability = await fetchJSON(
            `${ENDPOINT}/getCareerCycleAvailability`
        );
        const parsed = Array.isArray(carrerCycleAvailability) ? carrerCycleAvailability.map(n => CarrerCycleAvailabilityContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('CareerCycleAvailabilities:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const carrerCycleAvailability = await postJSON(
            `${ENDPOINT}/insertCareerCycleAvailability`,
            CarrerCycleAvailabilityContract.parse(data, 'create')
        );
        const parsed = CarrerCycleAvailabilityContract.parse(carrerCycleAvailability, 'table');
        document.dispatchEvent(new CustomEvent('CareerCycleAvailabilities:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const carrerCycleAvailability = await putJSON(
            `${ENDPOINT}/updateCareerCycleAvailability/${data.id}`,
            CarrerCycleAvailabilityContract.parse(data, 'update')
        );
        const parsed = CarrerCycleAvailabilityContract.parse(carrerCycleAvailability, 'table');
        document.dispatchEvent(new CustomEvent('CareerCycleAvailabilities:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteAcademicYear/${id}`
        );
        document.dispatchEvent(new CustomEvent('CareerCycleAvailabilities:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};