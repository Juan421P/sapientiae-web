import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { CodeGenatorsContract } from './../contracts/code-generators.contract.js';

const ENDPOINT = '/CodeGenerators';

export const CodeGenatorsService = {
    contract: CodeGenatorsContract,

    async list() {
        const codeGenerator = await fetchJSON(
            `${ENDPOINT}/getCodeGenerators`
        );
        const parsed = Array.isArray(codeGenerator) ? codeGenerator.map(n => CodeGenatorsContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('CodeGenerators:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const codeGenerator = await postJSON(
            `${ENDPOINT}/NewCodeGenerators`,
            CodeGenatorsContract.parse(data, 'create')
        );
        const parsed = CodeGenatorsContract.parse(codeGenerator, 'table');
        document.dispatchEvent(new CustomEvent('CodeGenerators:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const codeGenerator = await putJSON(
            `${ENDPOINT}/UpdateCodeGenerator/${data.id}`,
            CodeGenatorsContract.parse(data, 'update')
        );
        const parsed = CodeGenatorsContract.parse(codeGenerator, 'table');
        document.dispatchEvent(new CustomEvent('CodeGenerators:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/DeleteCodeGenerator/${id}`
        );
        document.dispatchEvent(new CustomEvent('CodeGenerators:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};