import { fetchJSON,postJSON,putJSON, deleteJSON } from "../lib/network";
import { PeopleContract } from "../contracts/people.contract";

const ENDPOINT = '/People'

export const PeopleService = {
    contract: PeopleContract,

    async list(){
        const people = await fetchJSON(
            `${ENDPOINT}/getPeople`
        );
        const parsed = Array.isArray(people) ? people.map(n => PeopleContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('people:list', {
            detail: parsed
        }));
        return parsed
    },

    async create(data){
        const people = await postJSON(
            `${ENDPOINT}/newPeople`,
            PeopleContract.parse(data, 'create')
        );
        const parsed = PeopleContract.parse(people, 'table');
        document.dispatchEvent(new CustomEvent('people:create', {
            detial: parsed
        }));
        return parsed;
    },

    async update(data){
        const people = await putJSON(
            `${ENDPOINT}/${data.personID}`,
            PeopleContract.parse(data, 'update')
        );
        const parsed = PeopleContract.parse(people, 'table');
        document.dispatchEvent(new CustomEvent('people:update', { detail:parsed}));
        return parsed;
    },

    async delete(id){
        const success = await deleteJSON(
            `${ENDPOINT}/deletePeople/${id}`
        );
        document.dispatchEvent(new CustomEvent('people:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
}