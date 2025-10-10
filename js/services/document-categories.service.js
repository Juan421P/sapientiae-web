import { fetchJSON, postJSON, putJSON, deleteJSON } from './../lib/network.js';
import { DocumentCategoriesContract } from './../contracts/document-categories.contract.js';

const ENDPOINT = '/documentCategories';

export const DocumentCategoriesService = {
    contract: DocumentCategoriesContract,

    async list() {
        const response = await fetchJSON(
            `${ENDPOINT}/getAllDocumentCategories`
        );
        const parsed = Array.isArray(response) ? response.map(d => DocumentCategoriesContract.parse(d, 'table')) : [];
        document.dispatchEvent(new CustomEvent('DocumentCategories:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const response = await postJSON(
            `${ENDPOINT}/AddDocumentCategory`,
            DocumentCategoriesContract.parse(data, 'create')
        );
        const parsed = DocumentCategoriesContract.parse(response.data, 'table');
        document.dispatchEvent(new CustomEvent('DocumentCategories:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const response = await putJSON(
            `${ENDPOINT}/${data.id}`,
            DocumentCategoriesContract.parse(data, 'update')
        );
        const parsed = DocumentCategoriesContract.parse(response, 'table');
        document.dispatchEvent(new CustomEvent('DocumentCategories:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/DeleteDocumentCategory/${id}`
        );
        document.dispatchEvent(new CustomEvent('DocumentCategories:delete', {
            detail: { 
                id, 
                success 
            }
        }));
        return success === true;
    }
};