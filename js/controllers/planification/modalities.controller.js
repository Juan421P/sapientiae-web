// Controller para Modalities
import ModalitiesService from '../../services/modalities.service.js';

class ModalitiesController {
    constructor() {
        this.service = new ModalitiesService();
        this.currentPage = 0;
        this.pageSize = 10;
        this.modalities = [];
        this.filteredModalities = [];
        this.editingId = null;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Inicializando Modalities controller...');
        this.setupEventListeners();
        this.loadModalities();
    }

    setupEventListeners() {
        // ✅ CORREGIDO: El ID correcto del botón
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
                    this.loadModalities();
                }
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                this.currentPage++;
                this.loadModalities();
            });
        }
    }

    async loadModalities() {
        try {
            const response = await this.service.getModalitiesPagination(this.currentPage, this.pageSize);
            this.modalities = response.content;
            this.filteredModalities = this.modalities;
            this.renderTable();
            this.updatePaginationInfo(response);
        } catch (error) {
            console.error('Error al cargar modalidades:', error);
            this.showError('Error al cargar las modalidades');
        }
    }

    renderTable() {
        const tbody = document.getElementById('modalities-table-body');
        tbody.innerHTML = '';

        if (this.filteredModalities.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="2" class="px-6 py-8 text-center text-[rgb(var(--text-from))]">
                        No se encontraron modalidades
                    </td>
                </tr>
            `;
            return;
        }

        this.filteredModalities.forEach(modality => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-[rgb(var(--body-from))]/30 transition-colors duration-200';
            // ✅ CORREGIDO: Usar id en lugar de modalityID
            row.innerHTML = `
                <td class="px-6 py-4 text-[rgb(var(--text-from))]">${modality.modalityName || 'N/A'}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center justify-center gap-2">
                        <button data-edit="${modality.id}" 
                            class="btn-edit p-2 rounded-lg hover:bg-[rgb(var(--button-from))]/20 transition-all duration-300">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                                stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-[rgb(var(--button-from))]">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button data-delete="${modality.id}" 
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
                this.editModality(id);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.delete;
                this.deleteModality(id);
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
            this.filteredModalities = this.modalities;
        } else {
            this.filteredModalities = this.modalities.filter(modality =>
                modality.modalityName?.toLowerCase().includes(term)
            );
        }

        this.renderTable();
    }

    openModal(modality = null) {
        const template = document.getElementById('modality-modal-template');
        const modal = template.content.cloneNode(true);
        document.body.appendChild(modal);

        const modalElement = document.getElementById('modality-modal');
        const form = document.getElementById('modality-form');
        const modalTitle = document.getElementById('modal-title');

        if (modality) {
            // ✅ CORREGIDO: Usar id
            this.editingId = modality.id;
            modalTitle.textContent = 'Editar Modalidad';
            document.getElementById('modality-id').value = modality.id;
            document.getElementById('modality-name').value = modality.modalityName;
        } else {
            this.editingId = null;
            modalTitle.textContent = 'Nueva Modalidad';
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
            this.saveModality();
        });
    }

    closeModal() {
        const modal = document.getElementById('modality-modal');
        if (modal) {
            modal.remove();
        }
    }

    async saveModality() {
        const modalityName = document.getElementById('modality-name').value.trim();

        if (!modalityName) {
            this.showError('El nombre de la modalidad es obligatorio');
            return;
        }

        const user = JSON.parse(sessionStorage.getItem('user'));
        
        console.log('👤 Usuario desde sessionStorage:', user);
        console.log('🏫 universityID del usuario:', user?.universityID);

        // ✅ CORREGIDO: Solo enviar los campos que acepta el backend
        const modalityData = {
            modalityName: modalityName,
            universityID: user?.universityID || "3F464A1A4360DF4E063DE54000A8ED4"
        };

        console.log('📤 Datos a enviar:', modalityData);

        try {
            if (this.editingId) {
                await this.service.updateModality(this.editingId, modalityData);
                this.showSuccess('Modalidad actualizada exitosamente');
            } else {
                await this.service.createModality(modalityData);
                this.showSuccess('Modalidad creada exitosamente');
            }

            this.closeModal();
            this.loadModalities();
        } catch (error) {
            console.error('❌ Error al guardar modalidad:', error);
            this.showError(error.message || 'Error al guardar la modalidad');
        }
    }

    async editModality(id) {
        console.log('✏️ Intentando editar modalidad con ID:', id);
        console.log('📋 Modalidades disponibles:', this.modalities);
        
        // ✅ CORREGIDO: Buscar por id
        const modality = this.modalities.find(m => m.id === id);
        console.log('🔍 Modalidad encontrada:', modality);
        
        if (modality) {
            this.openModal(modality);
        } else {
            this.showError('No se encontró la modalidad para editar');
        }
    }

    async deleteModality(id) {
        console.log('🗑️ Intentando eliminar modalidad con ID:', id);
        console.log('📋 Modalidades disponibles:', this.modalities);
        
        const modality = this.modalities.find(m => m.id === id);
        console.log('🔍 Modalidad encontrada:', modality);
        
        if (!modality) {
            this.showError('No se encontró la modalidad');
            return;
        }
        
        if (!confirm(`¿Está seguro de eliminar la modalidad "${modality.modalityName}"?`)) {
            return;
        }

        try {
            console.log('🚀 Enviando petición DELETE con ID:', id);
            await this.service.deleteModality(id);
            this.showSuccess('Modalidad eliminada exitosamente');
            this.loadModalities();
        } catch (error) {
            console.error('❌ Error completo al eliminar:', error);
            
            // ✅ Verificar tanto en message como en detail
            const errorText = (error.message || '') + ' ' + (error.detail || '');
            
            if (errorText.includes('integrity') || 
                errorText.includes('constraint') || 
                errorText.includes('child record') ||
                errorText.includes('ORA-02292') ||
                errorText.includes('FK_CAREERS_MODAL')) {
                this.showError('No se puede eliminar esta modalidad porque tiene carreras asociadas.\n\nPrimero debe eliminar o reasignar las carreras que usan esta modalidad.');
            } else {
                this.showError('Error al eliminar la modalidad');
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

const modalitiesController = new ModalitiesController();
window.modalitiesController = modalitiesController;

export default ModalitiesController;