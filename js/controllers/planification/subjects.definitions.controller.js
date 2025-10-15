// Controller para Subject Definitions
import { SubjectDefinitionsService } from '../../services/subject-definitions.service.js';
import { SubjectFamiliesService } from '../../services/subject-families.service.js';

class SubjectDefinitionsController {
    constructor() {
        this.subjectDefinitions = [];
        this.filteredDefinitions = [];
        this.subjectFamilies = [];
        this.editingId = null;
        this.listContainer = document.querySelector('#subject-definition-list');

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        console.log('Inicializando Subject Definitions controller...');
        await this.loadSubjectFamilies();
        this.setupEventListeners();
        this.loadSubjectDefinitions();
    }

    async loadSubjectFamilies() {
        try {
            // TODO: Descomentar cuando exista SubjectFamiliesService
            // this.subjectFamilies = await SubjectFamiliesService.get();
            this.subjectFamilies = []; // Temporal
            console.log('Familias de materias cargadas:', this.subjectFamilies);
        } catch (error) {
            console.error('Error al cargar familias de materias:', error);
            this.subjectFamilies = [];
        }
    }

    setupEventListeners() {
        const btnNew = document.getElementById('btn-new-subject-definition');
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

    async loadSubjectDefinitions() {
        try {
            this.subjectDefinitions = await SubjectDefinitionsService.get();
            this.filteredDefinitions = this.subjectDefinitions;
            this.renderCards();
        } catch (error) {
            console.error('Error al cargar definiciones de materias:', error);
            this.showError('Error al cargar las definiciones de materias');
        }
    }

    getSubjectFamilyName(subjectFamilyID) {
        const family = this.subjectFamilies.find(f => f.subjectFamilyID === subjectFamilyID);
        return family ? family.subjectFamilyName : 'Sin familia';
    }

    renderCards() {
        this.listContainer.innerHTML = this.filteredDefinitions.length ? this.filteredDefinitions.map(definition => `
            <div class="subject-definition-card p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col min-w-[300px] max-w-[500px]" data-id="${definition.subjectID}">
                <div class="mb-10">
                    <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-lg mb-2">
                        ${definition.subjectName || 'Sin nombre'}
                    </h2>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent mb-3 font-semibold">
                        Código: ${definition.subjectCode || 'Sin código'}
                    </p>
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 fill-current text-[rgb(var(--button-from))]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <p class="text-xs bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent font-semibold">
                            ${definition.subjectFamily || this.getSubjectFamilyName(definition.subjectFamilyID)}
                        </p>
                    </div>
                </div>
            </div>
        `).join('') : `
            <div class="text-center w-full py-10">
                <span class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow">
                    No hay definiciones de materias registradas.
                </span>
            </div>
        `;

        this.listContainer.querySelectorAll('.subject-definition-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const definition = this.subjectDefinitions.find(d => d.subjectID === id);
                this.showContextMenu(definition);
            });
        });
    }

    showContextMenu(definition) {
        ContextMenu.show([
            {
                label: 'Editar',
                icon: 'edit',
                onClick: () => this.editSubjectDefinition(definition.subjectID)
            },
            {
                label: 'Eliminar',
                icon: 'delete',
                onClick: () => this.deleteSubjectDefinition(definition.subjectID)
            }
        ]);
    }

    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();

        if (!term) {
            this.filteredDefinitions = this.subjectDefinitions;
        } else {
            this.filteredDefinitions = this.subjectDefinitions.filter(definition => {
                const name = (definition.subjectName || '').toLowerCase();
                const code = (definition.subjectCode || '').toLowerCase();
                const familyName = (definition.subjectFamily || this.getSubjectFamilyName(definition.subjectFamilyID)).toLowerCase();
                
                return name.includes(term) || 
                       code.includes(term) || 
                       familyName.includes(term);
            });
        }

        this.renderCards();
    }

    openModal(definition = null) {
        const template = document.getElementById('subject-definition-modal-template');
        const modal = template.content.cloneNode(true);
        document.body.appendChild(modal);

        const modalElement = document.getElementById('subject-definition-modal');
        const form = document.getElementById('subject-definition-form');
        const modalTitle = document.getElementById('modal-title');
        const subjectFamilySelect = document.getElementById('subject-family-select');

        this.subjectFamilies.forEach(family => {
            const option = document.createElement('option');
            option.value = family.subjectFamilyID;
            option.textContent = family.subjectFamilyName;
            subjectFamilySelect.appendChild(option);
        });

        if (definition) {
            this.editingId = definition.subjectID;
            modalTitle.textContent = 'Editar Materia';
            document.getElementById('subject-definition-id').value = definition.subjectID;
            document.getElementById('subject-name').value = definition.subjectName;
            document.getElementById('subject-code').value = definition.subjectCode;
            document.getElementById('subject-family-select').value = definition.subjectFamilyID;
        } else {
            this.editingId = null;
            modalTitle.textContent = 'Nueva Materia';
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
            this.saveSubjectDefinition();
        });
    }

    closeModal() {
        const modal = document.getElementById('subject-definition-modal');
        if (modal) {
            modal.remove();
        }
    }

    async saveSubjectDefinition() {
        const name = document.getElementById('subject-name').value.trim();
        const code = document.getElementById('subject-code').value.trim();
        const subjectFamilyID = document.getElementById('subject-family-select').value.trim();

        if (!name || !code || !subjectFamilyID) {
            this.showError('Todos los campos son obligatorios');
            return;
        }

        const definitionData = {
            subjectName: name,
            subjectCode: code,
            subjectFamilyID: subjectFamilyID
        };

        try {
            if (this.editingId) {
                await SubjectDefinitionsService.put(this.editingId, definitionData);
                this.showSuccess('Materia actualizada exitosamente');
            } else {
                await SubjectDefinitionsService.post(definitionData);
                this.showSuccess('Materia creada exitosamente');
            }

            this.closeModal();
            this.loadSubjectDefinitions();
        } catch (error) {
            console.error('Error al guardar materia:', error);
            this.showError('Error al guardar la materia');
        }
    }

    async editSubjectDefinition(id) {
        const definition = this.subjectDefinitions.find(d => d.subjectID === id);
        if (definition) {
            this.openModal(definition);
        }
    }

    async deleteSubjectDefinition(id) {
        const definition = this.subjectDefinitions.find(d => d.subjectID === id);
        if (!confirm(`¿Está seguro de eliminar la materia "${definition.subjectName}"?`)) {
            return;
        }

        try {
            await SubjectDefinitionsService.delete(id);
            this.showSuccess('Materia eliminada exitosamente');
            this.loadSubjectDefinitions();
        } catch (error) {
            console.error('Error al eliminar materia:', error);
            this.showError('Error al eliminar la materia');
        }
    }

    showSuccess(message) {
        alert(message);
    }

    showError(message) {
        alert(message);
    }
}

const subjectDefinitionsController = new SubjectDefinitionsController();
window.subjectDefinitionsController = subjectDefinitionsController;

export default SubjectDefinitionsController;