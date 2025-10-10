import { fetchJSON,postJSON,putJSON, deleteJSON } from "../lib/network";
import { PersonTypesContract } from "../contracts/person-types.contract";

const ENDPOINT = '/TypesPerson '

export const PersonTypeService = {
    contract: PersonTypesContract,

    async list(){
        const personType = await fetchJSON(
            `${ENDPOINT}/getDataUniversity`
        );
        const parsed = Array.isArray(personType) ? personType.map(n => PersonTypesContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('personType:list', {
            detail: parsed
        }));
        return parsed
    },

    async create(data){
        const personType = await postJSON(
            `${ENDPOINT}/newPersonType`,
            PersonTypesContract.parse(data, 'create')
        );
        const parsed = PersonTypesContract.parse(personType, 'table');
        document.dispatchEvent(new CustomEvent('personType:create', {
            detial: parsed
        }));
        return parsed;
    },

    async update(data){
        const personType = await putJSON(
            `${ENDPOINT}/${data.personTypeID}`,
            PersonTypesContract.parse(data, 'update')
        );
        const parsed = PersonTypesContract.parse(personType, 'table');
        document.dispatchEvent(new CustomEvent('personType:update', { detail:parsed}));
        return parsed;
    },

    async delete(id){
        const success = await deleteJSON(
            `${ENDPOINT}/deleteTypePerson/${id}`
        );
        document.dispatchEvent(new CustomEvent('personType:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
}