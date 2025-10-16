// Controller para Pensum
import { PensumService } from '../../services/pensa.service.js';

class PensumController {
    constructor() {
        this.currentPage = 0;
        this.pageSize = 10;
        this.pensa = [];
        this.filteredPensa = [];
        this.careers = [];
        this.editingId = null;
        this.thead = document.querySelector('#thead');
        this.tbody = document.querySelector('#tbody');
        this.headers = ['Carrera', 'Versión', 'Año Efectivo', 'Acciones'];

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        console.log('Inicializando Pensum controller...');
        this.renderTableHeaders();
        await this.loadCareers();
        this.setupEventListeners();
        this.loadPensa();
    }

    renderTableHeaders() {
        this.thead.innerHTML = `
            <tr class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] drop-shadow-sm">
                ${this.headers.map(h => `
                    <th class="px-5 py-4 text-left select-none text-white drop-shadow-sm">
                        ${h}
                    </th>
                `).join('')}
            </tr>
        `;
    }

    async loadCareers() {
        try {
            this.careers = await PensumService.getAllCareers();
            console.log('✅ Carreras cargadas:', this.careers);
        } catch (error) {
            console.error('❌ Error al cargar carreras:', error);
            this.careers = [];
        }
    }

    setupEventListeners() {
        const btnNew = document.getElementById('btn-new-pensum');
        const searchInput = document.getElementById('search-input');
        const btnPrev = document.getElementById('btn-prev-page');
        const btnNext = document.getElementById('btn-next-page');

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

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                if (this.currentPage > 0) {
                    this.currentPage--;
                    this.loadPensa();
                }
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                this.currentPage++;
                this.loadPensa();
            });
        }
    }

    async loadPensa() {
        try {
            const response = await PensumService.getPensumPagination(this.currentPage, this.pageSize);
            this.pensa = response.content;
            this.filteredPensa = this.pensa;
            console.log('✅ Pensa cargados:', this.pensa);
            this.renderTable();
            this.updatePaginationInfo(response);
        } catch (error) {
            console.error('❌ Error al cargar pensum:', error);
            this.showError('Error al cargar los pensum');
        }
    }

    getCareerName(careerID) {
        const career = this.careers.find(c => c.id === careerID);
        return career ? career.careerName : 'N/A';
    }

    renderTable() {
        this.tbody.innerHTML = this.filteredPensa.length ? this.filteredPensa.map(pensum => `
            <tr class="trow group hover:bg-gradient-to-r hover:from-[rgb(var(--button-from))] hover:to-[rgb(var(--button-to))] transition-colors cursor-pointer duration-150 group drop-shadow-sm" data-id="${pensum.pensumID}">
                <td class="px-5 py-4 text-[rgb(var(--button-from))] group-hover:text-[rgb(var(--card-from))] drop-shadow-xl">
                    ${this.getCareerName(pensum.careerID)}
                </td>
                <td class="px-5 py-4 text-[rgb(var(--button-from))] group-hover:text-[rgb(var(--card-from))] drop-shadow-xl">
                    ${pensum.version || 'N/A'}
                </td>
                <td class="px-5 py-4 text-[rgb(var(--button-from))] group-hover:text-[rgb(var(--card-from))] drop-shadow-xl">
                    ${pensum.effectiveYear || 'N/A'}
                </td>
                <td class="px-5 py-4">
                    <div class="flex items-center gap-2">
                        <button data-edit="${pensum.pensumID}" 
                            class="btn-edit p-2 rounded-lg hover:bg-white/20 transition-all duration-300">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                                stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-white group-hover:text-[rgb(var(--card-from))]">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button data-delete="${pensum.pensumID}" 
                            class="btn-delete p-2 rounded-lg hover:bg-red-500/20 transition-all duration-300">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                                stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-red-500">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : `
            <tr>
                <td class="px-5 py-4 text-center text-[rgb(var(--text-from))]" colspan="${this.headers.length}">
                    No se encontraron pensum
                </td>
            </tr>
        `;

        this.tbody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.edit;
                this.editPensum(id);
            });
        });

        this.tbody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.delete;
                this.deletePensum(id);
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
            this.filteredPensa = this.pensa;
        } else {
            this.filteredPensa = this.pensa.filter(pensum => {
                const careerName = this.getCareerName(pensum.careerID).toLowerCase();
                const version = (pensum.version || '').toLowerCase();
                const year = (pensum.effectiveYear || '').toString();
                
                return careerName.includes(term) || 
                       version.includes(term) || 
                       year.includes(term);
            });
        }

        this.renderTable();
    }

    openModal(pensum = null) {
        const template = document.getElementById('pensum-modal-template');
        const modal = template.content.cloneNode(true);
        document.body.appendChild(modal);

        const modalElement = document.getElementById('pensum-modal');
        const form = document.getElementById('pensum-form');
        const modalTitle = document.getElementById('modal-title');
        const careerSelect = document.getElementById('pensum-career');

        // Llenar select de carreras
        this.careers.forEach(career => {
            const option = document.createElement('option');
            option.value = career.id;
            option.textContent = career.careerName;
            careerSelect.appendChild(option);
        });

        if (pensum) {
            this.editingId = pensum.pensumID;
            modalTitle.textContent = 'Editar Pensum';
            document.getElementById('pensum-id').value = pensum.pensumID;
            document.getElementById('pensum-career').value = pensum.careerID;
            document.getElementById('pensum-version').value = pensum.version;
            document.getElementById('pensum-year').value = pensum.effectiveYear;
        } else {
            this.editingId = null;
            modalTitle.textContent = 'Nuevo Pensum';
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
            this.savePensum();
        });
    }

    closeModal() {
        const modal = document.getElementById('pensum-modal');
        if (modal) {
            modal.remove();
        }
    }

    async savePensum() {
        const careerID = document.getElementById('pensum-career').value.trim();
        const version = document.getElementById('pensum-version').value.trim();
        const effectiveYear = parseInt(document.getElementById('pensum-year').value);

        console.log('📤 Datos del formulario:', { careerID, version, effectiveYear });

        if (!careerID || !version || !effectiveYear) {
            this.showError('Todos los campos son obligatorios');
            return;
        }

        if (version.length > 20) {
            this.showError('La versión no puede exceder 20 caracteres');
            return;
        }

        if (effectiveYear < 1900 || effectiveYear > 2100) {
            this.showError('El año debe estar entre 1900 y 2100');
            return;
        }

        const pensumData = {
            careerID,
            version,
            effectiveYear
        };

        console.log('📦 Enviando datos:', pensumData);

        try {
            if (this.editingId) {
                await PensumService.updatePensum(this.editingId, pensumData);
                this.showSuccess('Pensum actualizado exitosamente');
            } else {
                await PensumService.createPensum(pensumData);
                this.showSuccess('Pensum creado exitosamente');
            }

            this.closeModal();
            this.loadPensa();
        } catch (error) {
            console.error('❌ Error al guardar pensum:', error);
            const errorText = (error.message || '') + ' ' + (error.detail || '');
            
            if (errorText.includes('integrity') || errorText.includes('constraint')) {
                this.showError('No se puede guardar. Verifica que no exista un pensum con los mismos datos.');
            } else {
                this.showError(error.message || 'Error al guardar el pensum');
            }
        }
    }

    async editPensum(id) {
        console.log('✏️ Editando pensum ID:', id);
        const pensum = this.pensa.find(p => p.pensumID === id);
        console.log('📋 Pensum encontrado:', pensum);
        
        if (pensum) {
            this.openModal(pensum);
        } else {
            this.showError('No se encontró el pensum');
        }
    }

    async deletePensum(id) {
        console.log('🗑️ Eliminando pensum ID:', id);
        const pensum = this.pensa.find(p => p.pensumID === id);
        
        if (!pensum) {
            this.showError('No se encontró el pensum');
            return;
        }

        if (!confirm(`¿Está seguro de eliminar el pensum versión "${pensum.version}"?`)) {
            return;
        }

        try {
            await PensumService.deletePensum(id);
            this.showSuccess('Pensum eliminado exitosamente');
            this.loadPensa();
        } catch (error) {
            console.error('❌ Error al eliminar pensum:', error);
            const errorText = (error.message || '') + ' ' + (error.detail || '');
            
            if (errorText.includes('integrity') || errorText.includes('constraint') || errorText.includes('child record')) {
                this.showError('No se puede eliminar este pensum porque tiene materias asociadas.\n\nPrimero debe eliminar las materias relacionadas.');
            } else {
                this.showError('Error al eliminar el pensum');
            }
        }
    }

    showSuccess(message) {
        alert(message);
    }

    showError(message) {
        alert(message);
    }
}

const pensumController = new PensumController();
window.pensumController = pensumController;

export default PensumController;