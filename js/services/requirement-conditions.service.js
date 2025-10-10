import { fetchJSON,postJSON,putJSON, deleteJSON } from "../lib/network";
import { RequirementConditionsContract } from "../contracts/requirement-conditions.contract";

const ENDPOINT = '/RequirementConditions'

export const RequirementConditionsService = {
    contract: RequirementConditionsContract,

    async create(data){
        const requirementCondition = await postJSON(
            `${ENDPOINT}/newRequirementCondition`,
            RequirementConditionsContract.parse(data, 'create')
        );
        const parsed = RequirementConditionsContract.parse(requirementCondition, 'table');
        document.dispatchEvent(new CustomEvent('requirementCondition:create', {
            detial: parsed
        }));
        return parsed;
    },

    async update(data){
        const requirementCondition = await putJSON(
            `${ENDPOINT}/${data.requirementConditionID}`,
            RequirementConditionsContract.parse(data, 'update')
        );
        const parsed = RequirementConditionsContract.parse(requirementCondition, 'table');
        document.dispatchEvent(new CustomEvent('requirementCondition:update', { detail:parsed}));
        return parsed;
    },

    async delete(id){
        const success = await deleteJSON(
            `${ENDPOINT}/deleteRequirementCondition/${id}`
        );
        document.dispatchEvent(new CustomEvent('requirementCondition:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
}