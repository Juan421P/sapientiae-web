// Controller para Localities

import LocalitiesService from '../../services/localities.service';

class LocalitiesController {
    constructor() {
        this.service = new LocalitiesService();
        this.currentPage = 0;
        this.pageSize = 10;
        this.localities = [];
        this.filteredLocalities = [];
        this.editingId = null;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Inicializando controller...');
        this.setupEventListeners();
        this.loadLocalities();
    }

    setupEventListeners() {
        const btnNew = document.getElementById('btn-new-locality');
        const searchInput = document.getElementById('search-input');
        const btnPrev = document.getElementById('btn-prev-page');
        const btnNext = document.getElementById('btn-next-page');

        console.log('Botones encontrados:', { btnNew, searchInput, btnPrev, btnNext });

        if (btnNew) {
            btnNew.addEventListener('click', () => {
                console.log('Click en nueva localidad');
                this.openModal();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                if (this.currentPage > 0) {
                    this.currentPage--;
                    this.loadLocalities();
                }
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                this.currentPage++;
                this.loadLocalities();
            });
        }
    }

    async loadLocalities() {
        try {
            const response = await this.service.getLocalitiesPagination(this.currentPage, this.pageSize);
            this.localities = response.content;
            this.filteredLocalities = this.localities;
            this.renderTable();
            this.updatePaginationInfo(response);
        } catch (error) {
            console.error('Error al cargar localidades:', error);
            this.showError('Error al cargar las localidades');
        }
    }

    renderTable() {
        const tbody = document.getElementById('localities-table-body');
        tbody.innerHTML = '';

        if (this.filteredLocalities.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="px-6 py-8 text-center text-[rgb(var(--text-from))]">
                        No se encontraron localidades
                    </td>
                </tr>
            `;
            return;
        }

        this.filteredLocalities.forEach(locality => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-[rgb(var(--body-from))]/30 transition-colors duration-200';
            row.innerHTML = `
                <td class="px-6 py-4 text-[rgb(var(--text-from))]">${locality.address || 'N/A'}</td>
                <td class="px-6 py-4 text-[rgb(var(--text-from))]">${locality.phoneNumber || 'N/A'}</td>
                <td class="px-6 py-4 text-[rgb(var(--text-from))]">
                    ${locality.isMainLocality ? 
                        '<span class="px-3 py-1 rounded-full bg-green-500/20 text-green-600 text-xs font-semibold">Sí</span>' : 
                        '<span class="px-3 py-1 rounded-full bg-gray-500/20 text-gray-600 text-xs font-semibold">No</span>'}
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center justify-center gap-2">
                        <button data-edit="${locality.localityID}" 
                            class="btn-edit p-2 rounded-lg hover:bg-[rgb(var(--button-from))]/20 transition-all duration-300">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                                stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-[rgb(var(--button-from))]">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button data-delete="${locality.localityID}" 
                            class="btn-delete p-2 rounded-lg hover:bg-red-500/20 transition-all duration-300">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                                stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-red-500">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.edit;
                this.editLocality(id);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.delete;
                this.deleteLocality(id);
            });
        });
    }

    updatePaginationInfo(response) {
        const start = response.number * response.size + 1;
        const end = Math.min((response.number + 1) * response.size, response.totalElements);
        
        document.getElementById('showing-start').textContent = start;
        document.getElementById('showing-end').textContent = end;
        document.getElementById('total-records').textContent = response.totalElements;

        document.getElementById('btn-prev-page').disabled = response.first;
        document.getElementById('btn-next-page').disabled = response.last;
    }

    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (!term) {
            this.filteredLocalities = this.localities;
        } else {
            this.filteredLocalities = this.localities.filter(locality => 
                locality.address?.toLowerCase().includes(term) ||
                locality.phoneNumber?.toLowerCase().includes(term)
            );
        }
        
        this.renderTable();
    }

    openModal(locality = null) {
        const template = document.getElementById('locality-modal-template');
        const modal = template.content.cloneNode(true);
        document.body.appendChild(modal);

        const modalElement = document.getElementById('locality-modal');
        const form = document.getElementById('locality-form');
        const modalTitle = document.getElementById('modal-title');

        if (locality) {
            this.editingId = locality.localityID;
            modalTitle.textContent = 'Editar Localidad';
            document.getElementById('locality-id').value = locality.localityID;
            document.getElementById('address').value = locality.address;
            document.getElementById('phone-number').value = locality.phoneNumber;
            document.getElementById('is-main-locality').value = locality.isMainLocality.toString();
        } else {
            this.editingId = null;
            modalTitle.textContent = 'Nueva Localidad';
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
            this.saveLocality();
        });
    }

    closeModal() {
        const modal = document.getElementById('locality-modal');
        if (modal) {
            modal.remove();
        }
    }

    async saveLocality() {
        const address = document.getElementById('address').value.trim();
        const phoneNumber = document.getElementById('phone-number').value.trim();
        const isMainLocality = document.getElementById('is-main-locality').value === 'true';

        if (!address || !phoneNumber) {
            this.showError('Todos los campos son obligatorios');
            return;
        }

        const localityData = {
            address,
            phoneNumber,
            isMainLocality,
            universityID: "default-university-id"
        };

        try {
            if (this.editingId) {
                await this.service.updateLocality(this.editingId, localityData);
                this.showSuccess('Localidad actualizada exitosamente');
            } else {
                await this.service.createLocality(localityData);
                this.showSuccess('Localidad creada exitosamente');
            }

            this.closeModal();
            this.loadLocalities();
        } catch (error) {
            console.error('Error al guardar localidad:', error);
            this.showError('Error al guardar la localidad');
        }
    }

    async editLocality(id) {
        const locality = this.localities.find(l => l.localityID === id);
        if (locality) {
            this.openModal(locality);
        }
    }

    async deleteLocality(id) {
        if (!confirm('¿Está seguro de eliminar esta localidad?')) {
            return;
        }

        try {
            await this.service.deleteLocality(id);
            this.showSuccess('Localidad eliminada exitosamente');
            this.loadLocalities();
        } catch (error) {
            console.error('Error al eliminar localidad:', error);
            this.showError('Error al eliminar la localidad');
        }
    }

    showSuccess(message) {
        alert(message);
    }

    showError(message) {
        alert(message);
    }
}

const localitiesController = new LocalitiesController();
window.localitiesController = localitiesController;

export default LocalitiesController;