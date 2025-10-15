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

    // Crear nueva modalidad
    async createModality(modalityData) {
        try {
            const response = await fetch(`${this.baseURL}/insertModality`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(modalityData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear la modalidad');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en createModality:', error);
            throw error;
        }
    }

    // Actualizar modalidad
    async updateModality(id, modalityData) {
        try {
            const response = await fetch(`${this.baseURL}/updateModalities/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(modalityData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar la modalidad');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en updateModality:', error);
            throw error;
        }
    }

    // Eliminar modalidad
    async deleteModality(id) {
        try {
            const response = await fetch(`${this.baseURL}/deleteModality/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar la modalidad');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en deleteModality:', error);
            throw error;
        }
    }
}

export default ModalitiesService;