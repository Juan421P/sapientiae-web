import { fetchJSON,postJSON,putJSON, deleteJSON } from "../lib/network";
import { RequirementsContract } from "../contracts/requirements.contract";

const ENDPOINT = '/Requirements'

export const RequirementService = {
    contract: RequirementsContract,

    async list(){
        const requirement = await fetchJSON(
            `${ENDPOINT}/GetAllRequirements`
        );
        const parsed = Array.isArray(requirement) ? requirement.map(n => RequirementsContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('Requirements:list', {
            detail: parsed
        }));
        return parsed
    },

    async create(data){s
        const requirement = await postJSON(
            `${ENDPOINT}/AddRequirement`,
            RequirementsContract.parse(data, 'create')
        );
        const parsed = RequirementsContract.parse(requirement, 'table');
        document.dispatchEvent(new CustomEvent('Requirements:create', {
            detial: parsed
        }));
        return parsed;
    },

    async update(data){
        const requirement = await putJSON(
            `${ENDPOINT}/${data.requirementID}`,
            RequirementsContract.parse(data, 'update')
        );
        const parsed = RequirementsContract.parse(requirement, 'table');
        document.dispatchEvent(new CustomEvent('Requirements:update', { detail:parsed}));
        return parsed;
    },

    async delete(id){
        const success = await deleteJSON(
            `${ENDPOINT}/DeleteRequirement/${id}`
        );
        document.dispatchEvent(new CustomEvent('Requirements:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
}