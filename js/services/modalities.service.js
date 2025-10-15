// Service para Modalities
class ModalitiesService {
    constructor() {
        this.baseURL = 'https://sapientiae-api-bd9a54b3d7a1.herokuapp.com/api/Modalities';
    }

    async getModalitiesPagination(page = 0, size = 10) {
        try {
            const response = await fetch(`${this.baseURL}/getModalitiesPagination?page=${page}&size=${size}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Error al obtener las modalidades');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getModalitiesPagination:', error);
            throw error;
        }
    }

    async getAllModalities() {
        try {
            const response = await fetch(`${this.baseURL}/getModalities`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Error al obtener las modalidades');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getAllModalities:', error);
            throw error;
        }
    }

    async createModality(modalityData) {
        try {
            console.log('📤 POST Request:', `${this.baseURL}/insertModality`);
            console.log('📦 Body:', JSON.stringify(modalityData));

            const response = await fetch(`${this.baseURL}/insertModality`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(modalityData)
            });

            console.log('📥 Response status:', response.status, response.statusText);

            const responseData = await response.json();
            console.log('📥 Response data:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || responseData.detail || 'Error al crear la modalidad');
            }

            return responseData;
        } catch (error) {
            console.error('❌ Error en createModality:', error);
            throw error;
        }
    }

    async updateModality(id, modalityData) {
        try {
            console.log('📤 PUT Request:', `${this.baseURL}/updateModalities/${id}`);
            console.log('📦 Body:', JSON.stringify(modalityData));

            const response = await fetch(`${this.baseURL}/updateModalities/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(modalityData)
            });

            console.log('📥 Response status:', response.status, response.statusText);

            const responseData = await response.json();
            console.log('📥 Response data:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || responseData.detail || 'Error al actualizar la modalidad');
            }

            return responseData;
        } catch (error) {
            console.error('❌ Error en updateModality:', error);
            throw error;
        }
    }

    async deleteModality(id) {
        try {
            console.log('📤 DELETE Request:', `${this.baseURL}/deleteModality/${id}`);

            const response = await fetch(`${this.baseURL}/deleteModality/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            console.log('📥 Response status:', response.status, response.statusText);

            // ✅ Intentar parsear JSON, pero manejar si falla
            let responseData;
            try {
                responseData = await response.json();
                console.log('📥 Response data:', responseData);
            } catch (jsonError) {
                console.warn('⚠️ La respuesta no es JSON válido');
                responseData = { message: response.statusText };
            }

            if (!response.ok) {
                throw new Error(responseData.message || responseData.detail || 'Error al eliminar la modalidad');
            }

            return responseData;
        } catch (error) {
            console.error('❌ Error en deleteModality:', error);
            throw error;
        }
    }
}

export default ModalitiesService;