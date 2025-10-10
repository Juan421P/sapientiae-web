import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { CycleTypesContract } from './../contracts/cycle-types.contract.js';

const ENDPOINT = '/CycleTypes';

export const CycleTypesService = {
    contract: CycleTypesContract,

    async list() {
        const cycleTypes = await fetchJSON(
            `${ENDPOINT}/getAllCycleTypes`
        );
        const parsed = Array.isArray(cycleTypes) ? cycleTypes.map(n => CycleTypesContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('CycleTypes:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const cycleTypes = await postJSON(
            `${ENDPOINT}/AddCycleType`,
            CycleTypesContract.parse(data, 'create')
        );
        const parsed = CycleTypesContract.parse(cycleTypes, 'table');
        document.dispatchEvent(new CustomEvent('CycleTypes:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const cycleTypes = await putJSON(
            `${ENDPOINT}/UpdateCycleType/${data.id}`,
            CycleTypesContract.parse(data, 'update')
        );
        const parsed = CycleTypesContract.parse(cycleTypes, 'table');
        document.dispatchEvent(new CustomEvent('CycleTypes:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/DeleteCycleType/${id}`
        );
        document.dispatchEvent(new CustomEvent('CycleTypes:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};