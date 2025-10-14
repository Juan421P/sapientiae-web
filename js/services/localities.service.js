// Service para Localities
class LocalitiesService {
    constructor() {
        this.baseURL = 'https://sapientiae-api-bd9a54b3d7a1.herokuapp.com/api/Locality';
    }

    async getLocalitiesPagination(page = 0, size = 10) {
        try {
            const response = await fetch(`${this.baseURL}/getLocalitiesPagination?page=${page}&size=${size}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Error al obtener las localidades');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getLocalitiesPagination:', error);
            throw error;
        }
    }

    async getAllLocalities() {
        try {
            const response = await fetch(`${this.baseURL}/getDataLocality`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Error al obtener las localidades');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getAllLocalities:', error);
            throw error;
        }
    }

    async createLocality(localityData) {
        try {
            const response = await fetch(`${this.baseURL}/newLocality`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(localityData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear la localidad');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en createLocality:', error);
            throw error;
        }
    }

    async updateLocality(id, localityData) {
        try {
            const response = await fetch(`${this.baseURL}/updateLocality/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(localityData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar la localidad');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en updateLocality:', error);
            throw error;
        }
    }

    async deleteLocality(id) {
        try {
            const response = await fetch(`${this.baseURL}/deleteLocation/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar la localidad');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en deleteLocality:', error);
            throw error;
        }
    }
}

export default LocalitiesService;