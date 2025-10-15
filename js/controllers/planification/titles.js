import { DegreeTypesService } from './../../services/titles.js';
import { UniversityService } from './../../services/universities.service.js';

const degreeTypeList = document.querySelector('#degree-type-list');
const addDegreeTypeBtn = document.querySelector('#add-degree-type');
const searchInput = document.querySelector('#degree-type-search');
const prevPageBtn = document.querySelector('#prev-page');
const nextPageBtn = document.querySelector('#next-page');
const pageInfo = document.querySelector('#page-info');

let currentPage = 0;
let totalPages = 0;
let allDegreeTypes = [];
let filteredDegreeTypes = [];
const pageSize = 10;

async function loadUniversities() {
    try {
        const universities = await UniversityService.get();
        return universities;
    } catch (error) {
        Toast.show('Error al cargar universidades', 'error');
        return [];
    }
}

function populateDegreeTypes(degreeTypes) {
    degreeTypeList.innerHTML = degreeTypes.length
        ? degreeTypes.map(dt => `
            <div class="degree-type-card p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col min-w-[280px] max-w-[400px]" data-id="${dt.id}">
                <div class="mb-4">
                    <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-lg mb-3">
                        ${dt.degreeTypeName || 'Sin nombre'}
                    </h2>
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[rgb(var(--placeholder-from))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
                            ${dt.universityName || 'Sin universidad'}
                        </span>
                    </div>
                </div>
                <div class="mt-auto">
                    <span class="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] text-white font-semibold select-none shadow">
                        ${dt.universityName || 'Sin universidad'}
                    </span>
                </div>
            </div>
        `).join('')
        : `
            <div class="text-center w-full py-10">
                <span class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow text-lg">
                    No hay tipos de título registrados.
                </span>
            </div>
        `;

    attachCardEvents();
}

function attachCardEvents() {
    degreeTypeList.querySelectorAll('.degree-type-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const degreeType = allDegreeTypes.find(dt => dt.id === id);
            
            ContextMenu.show([
                {
                    label: 'Editar',
                    icon: 'edit',
                    onClick: () => showEditForm(degreeType)
                },
                {
                    label: 'Eliminar',
                    icon: 'delete',
                    onClick: async () => {
                        try {
                            await DegreeTypesService.delete(id);
                            Toast.show('Tipo de título eliminado', 'success');
                            await loadDegreeTypes();
                        } catch {
                            Toast.show('Error al eliminar', 'error');
                        }
                    }
                }
            ]);
        });
    });
}

async function loadDegreeTypes() {
    try {
        const response = await DegreeTypesService.getPaginated(currentPage, pageSize);
        
        allDegreeTypes = response.content || [];
        filteredDegreeTypes = [...allDegreeTypes];
        totalPages = response.totalPages || 1;
        
        populateDegreeTypes(filteredDegreeTypes);
        updatePaginationControls();
    } catch (error) {
        Toast.show('Error al cargar tipos de título', 'error');
        console.error(error);
    }
}

function updatePaginationControls() {
    pageInfo.textContent = `Página ${currentPage + 1} de ${totalPages}`;
    prevPageBtn.disabled = currentPage === 0;
    nextPageBtn.disabled = currentPage >= totalPages - 1;
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        filteredDegreeTypes = [...allDegreeTypes];
    } else {
        filteredDegreeTypes = allDegreeTypes.filter(dt => 
            dt.degreeTypeName?.toLowerCase().includes(searchTerm) ||
            dt.universityName?.toLowerCase().includes(searchTerm)
        );
    }
    
    populateDegreeTypes(filteredDegreeTypes);
});

prevPageBtn.addEventListener('click', async () => {
    if (currentPage > 0) {
        currentPage--;
        await loadDegreeTypes();
    }
});

nextPageBtn.addEventListener('click', async () => {
    if (currentPage < totalPages - 1) {
        currentPage++;
        await loadDegreeTypes();
    }
});

addDegreeTypeBtn.addEventListener('click', () => showAddForm());

async function showAddForm() {
    const template = document.querySelector('#tmpl-add-degree-type');
    const form = template.content.cloneNode(true);
    
    const universities = await loadUniversities();
    const select = form.querySelector('#university-select');
    
    universities.forEach(uni => {
        const option = document.createElement('option');
        option.value = uni.universityID;
        option.textContent = uni.universityName;
        select.appendChild(option);
    });
    
    const formElement = form.querySelector('#degree-type-form');
    formElement.addEventListener('submit', handleAddSubmit);
    
    form.querySelector('#cancel-btn').addEventListener('click', () => Modal.hide());
    
    Modal.show(formElement);
}

async function showEditForm(degreeType) {
    const template = document.querySelector('#tmpl-add-degree-type');
    const form = template.content.cloneNode(true);
    
    form.querySelector('#form-title').textContent = 'Editar tipo de título';
    
    const universities = await loadUniversities();
    const select = form.querySelector('#university-select');
    
    universities.forEach(uni => {
        const option = document.createElement('option');
        option.value = uni.universityID;
        option.textContent = uni.universityName;
        if (uni.universityID === degreeType.universityID) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    form.querySelector('#degree-type-name').value = degreeType.degreeTypeName;
    
    const formElement = form.querySelector('#degree-type-form');
    formElement.dataset.editId = degreeType.id;
    formElement.addEventListener('submit', handleEditSubmit);
    
    form.querySelector('#cancel-btn').addEventListener('click', () => Modal.hide());
    
    Modal.show(formElement);
}

async function handleAddSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        universityID: formData.get('universityID'),
        degreeTypeName: formData.get('degreeTypeName')
    };
    
    if (!data.universityID || !data.degreeTypeName) {
        Toast.show('Todos los campos son requeridos', 'warn');
        return;
    }
    
    try {
        await DegreeTypesService.post(data);
        Toast.show('Tipo de título creado exitosamente', 'success');
        Modal.hide();
        await loadDegreeTypes();
    } catch (error) {
        Toast.show('Error al crear tipo de título', 'error');
        console.error(error);
    }
}

async function handleEditSubmit(e) {
    e.preventDefault();
    
    const id = e.target.dataset.editId;
    const formData = new FormData(e.target);
    const data = {
        universityID: formData.get('universityID'),
        degreeTypeName: formData.get('degreeTypeName')
    };
    
    if (!data.universityID || !data.degreeTypeName) {
        Toast.show('Todos los campos son requeridos', 'warn');
        return;
    }
    
    try {
        await DegreeTypesService.put(id, data);
        Toast.show('Tipo de título actualizado exitosamente', 'success');
        Modal.hide();
        await loadDegreeTypes();
    } catch (error) {
        Toast.show('Error al actualizar tipo de título', 'error');
        console.error(error);
    }
}

await loadDegreeTypes();