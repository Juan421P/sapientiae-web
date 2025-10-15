// Controller para Social Service
import { SocialServiceService } from '../../services/social-service.service.js';
import { UniversityService } from '../../services/universities.service.js';

class SocialServiceController {
    constructor() {
        this.socialServices = [];
        this.filteredServices = [];
        this.universities = [];
        this.editingId = null;
        this.listContainer = document.querySelector('#social-service-list');

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        console.log('Inicializando Social Service controller...');
        await this.loadUniversities();
        this.setupEventListeners();
        this.loadSocialServices();
    }

    async loadUniversities() {
        try {
            this.universities = await UniversityService.get();
            console.log('Universidades cargadas:', this.universities);
        } catch (error) {
            console.error('Error al cargar universidades:', error);
            this.universities = [];
        }
    }

    setupEventListeners() {
        const btnNew = document.getElementById('btn-new-social-service');
        const searchInput = document.getElementById('search-input');

        if (btnNew) {
            btnNew.addEventListener('click', () => {
                this.openModal();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    async loadSocialServices() {
        try {
            this.socialServices = await SocialServiceService.get();
            this.filteredServices = this.socialServices;
            this.renderCards();
        } catch (error) {
            console.error('Error al cargar proyectos:', error);
            this.showError('Error al cargar los proyectos de servicio social');
        }
    }

    getUniversityName(universityID) {
        const university = this.universities.find(u => u.universityID === universityID);
        return university ? university.universityName : 'Sin universidad';
    }

    renderCards() {
        this.listContainer.innerHTML = this.filteredServices.length ? this.filteredServices.map(service => `
            <div class="social-service-card p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col min-w-[300px] max-w-[500px]" data-id="${service.socialServiceProjectID}">
                <div class="mb-10">
                    <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-lg mb-2">
                        ${service.socialServiceProjectName || 'Sin nombre'}
                    </h2>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent mb-3">
                        ${service.description || 'Sin descripción'}
                    </p>
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 fill-current text-[rgb(var(--button-from))]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <p class="text-xs bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent font-semibold">
                            ${service.universityName || this.getUniversityName(service.universityID)}
                        </p>
                    </div>
                </div>
            </div>
        `).join('') : `
            <div class="text-center w-full py-10">
                <span class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow">
                    No hay proyectos de servicio social registrados.
                </span>
            </div>
        `;

        this.listContainer.querySelectorAll('.social-service-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const service = this.socialServices.find(s => s.socialServiceProjectID === id);
                this.showContextMenu(service);
            });
        });
    }

    showContextMenu(service) {
        ContextMenu.show([
            {
                label: 'Editar',
                icon: 'edit',
                onClick: () => this.editSocialService(service.socialServiceProjectID)
            },
            {
                label: 'Eliminar',
                icon: 'delete',
                onClick: () => this.deleteSocialService(service.socialServiceProjectID)
            }
        ]);
    }

    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();

        if (!term) {
            this.filteredServices = this.socialServices;
        } else {
            this.filteredServices = this.socialServices.filter(service => {
                const name = (service.socialServiceProjectName || '').toLowerCase();
                const description = (service.description || '').toLowerCase();
                const universityName = (service.universityName || this.getUniversityName(service.universityID)).toLowerCase();
                
                return name.includes(term) || 
                       description.includes(term) || 
                       universityName.includes(term);
            });
        }

        this.renderCards();
    }

    openModal(service = null) {
        const template = document.getElementById('social-service-modal-template');
        const modal = template.content.cloneNode(true);
        document.body.appendChild(modal);

        const modalElement = document.getElementById('social-service-modal');
        const form = document.getElementById('social-service-form');
        const modalTitle = document.getElementById('modal-title');
        const universitySelect = document.getElementById('university-select');

        this.universities.forEach(university => {
            const option = document.createElement('option');
            option.value = university.universityID;
            option.textContent = university.universityName;
            universitySelect.appendChild(option);
        });

        if (service) {
            this.editingId = service.socialServiceProjectID;
            modalTitle.textContent = 'Editar Proyecto';
            document.getElementById('social-service-id').value = service.socialServiceProjectID;
            document.getElementById('project-name').value = service.socialServiceProjectName;
            document.getElementById('project-description').value = service.description;
            document.getElementById('university-select').value = service.universityID;
        } else {
            this.editingId = null;
            modalTitle.textContent = 'Nuevo Proyecto';
        }

        document.getElementById('btn-cancel-modal').addEventListener('click', () => {
            this.closeModal();
        });

        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement) {
                this.closeModal();
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSocialService();
        });
    }

    closeModal() {
        const modal = document.getElementById('social-service-modal');
        if (modal) {
            modal.remove();
        }
    }

    async saveSocialService() {
        const name = document.getElementById('project-name').value.trim();
        const description = document.getElementById('project-description').value.trim();
        const universityID = document.getElementById('university-select').value.trim();

        if (!name || !description || !universityID) {
            this.showError('Todos los campos son obligatorios');
            return;
        }

        const serviceData = {
            socialServiceProjectName: name,
            description: description,
            universityID: universityID
        };

        try {
            if (this.editingId) {
                await SocialServiceService.put(this.editingId, serviceData);
                this.showSuccess('Proyecto actualizado exitosamente');
            } else {
                await SocialServiceService.post(serviceData);
                this.showSuccess('Proyecto creado exitosamente');
            }

            this.closeModal();
            this.loadSocialServices();
        } catch (error) {
            console.error('Error al guardar proyecto:', error);
            this.showError('Error al guardar el proyecto');
        }
    }

    async editSocialService(id) {
        const service = this.socialServices.find(s => s.socialServiceProjectID === id);
        if (service) {
            this.openModal(service);
        }
    }

    async deleteSocialService(id) {
        const service = this.socialServices.find(s => s.socialServiceProjectID === id);
        if (!confirm(`¿Está seguro de eliminar el proyecto "${service.socialServiceProjectName}"?`)) {
            return;
        }

        try {
            await SocialServiceService.delete(id);
            this.showSuccess('Proyecto eliminado exitosamente');
            this.loadSocialServices();
        } catch (error) {
            console.error('Error al eliminar proyecto:', error);
            this.showError('Error al eliminar el proyecto');
        }
    }

    showSuccess(message) {
        alert(message);
    }

    showError(message) {
        alert(message);
    }
}

const socialServiceController = new SocialServiceController();
window.socialServiceController = socialServiceController;

export default SocialServiceController;