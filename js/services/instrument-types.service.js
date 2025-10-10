import { fetchJSON, postJSON, putJSON, deleteJSON } from "../lib/network.js";
import { InstrumentTypesContract } from "../contracts/instrument-types.contract";

const ENDPOINT = '/InstrumentType'

export const InstrumentTypeService = {
    contract: InstrumentTypesContract,

    async list() {
        const instrumentType = await fetchJSON(
            `${ENDPOINT}/getInstrumentType`
        );
        const parsed = Array.isArray(instrumentType) ? instrumentType.map(n => InstrumentTypesContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('InstrumentTypes:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const instrumentType = await postJSON(
            `${ENDPOINT}/newInstrumentType`,
            InstrumentTypesContract.parse(data, 'create')
        );
        const parsed = InstrumentTypesContract.parse(instrumentType, 'table');
        document.dispatchEvent(new CustomEvent('instrumentType:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const instrumentType = await putJSON(
            `${ENDPOINT}/${data.instrumentTypeID}`,
            InstrumentTypesContract.parse(data, 'update')
        );
        const parsed = InstrumentTypesContract.parse(instrumentType, 'table');
        document.dispatchEvent(new CustomEvent('instrumentType::update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteInstrumentType/${id}`
        );
        document.dispatchEvent(new CustomEvent('instrumentType:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
}