import { ModalitiesService } from './../../services/modalities.service';
import { UniversityService } from './../../services/universities.service';

const modalityList = document.querySelector('#modality-list');
const searchInput = document.querySelector('#modality-search');
const addModalityBtn = document.querySelector('#add-modality-btn');

let allModalities = [];
let allUniversities = [];

function populateModalities(modalities) {
    modalityList.innerHTML = modalities.length
        ? modalities.map(m => `
            <div class="modality-card p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col min-w-[300px] max-w-[500px]" data-id="${m.id}">
                <div class="mb-6">
                    <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-lg mb-3">
                        ${m.modalityName || 'Sin nombre'}
                    </h2>
                    <span class="inline-block mt-2 px-3 py-1 text-xs rounded bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] text-white font-semibold select-none drop-shadow">
                        ${m.universityName || 'Sin universidad'}
                    </span>
                </div>
            </div>
        `).join('')
        : `
            <div class="text-center w-full py-10">
                <span class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow">
                    No hay modalidades registradas.
                </span>
            </div>
        `;

    modalityList.querySelectorAll('.modality-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const modality = allModalities.find(m => m.id === id);
            
            ContextMenu.show([
                {
                    label: 'Ver detalles',
                    icon: 'view',
                    onClick: () => showViewModal(modality)
                },
                {
                    label: 'Editar',
                    icon: 'edit',
                    onClick: () => showEditModal(modality)
                },
                {
                    label: 'Eliminar',
                    icon: 'delete',
                    onClick: async () => {
                        const confirmed = await Toast.confirm('¿Estás seguro de eliminar esta modalidad?');
                        if (confirmed) {
                            try {
                                await ModalitiesService.delete(id);
                                Toast.show('Modalidad eliminada correctamente', 'success');
                                await loadModalities();
                            } catch (error) {
                                Toast.show('Error al eliminar la modalidad', 'error');
                                console.error(error);
                            }
                        }
                    }
                }
            ]);
        });
    });
}

async function loadModalities() {
    try {
        allModalities = await ModalitiesService.get();
        populateModalities(allModalities);
    } catch (error) {
        Toast.show('Error al cargar las modalidades', 'error');
        console.error(error);
        populateModalities([]);
    }
}

async function loadUniversities() {
    try {
        allUniversities = await UniversityService.get();
    } catch (error) {
        Toast.show('Error al cargar las universidades', 'error');
        console.error(error);
        allUniversities = [];
    }
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        populateModalities(allModalities);
        return;
    }

    const filtered = allModalities.filter(m => 
        (m.modalityName || '').toLowerCase().includes(searchTerm) ||
        (m.universityName || '').toLowerCase().includes(searchTerm)
    );

    populateModalities(filtered);
});

function populateSelect(selectRoot, options = [], selectedValue = null) {
    if (!selectRoot) return;

    const menu = selectRoot.querySelector('[data-menu]');
    const text = selectRoot.querySelector('[data-text]');
    const input = selectRoot.querySelector('[data-input]');
    const chevron = selectRoot.querySelector('[data-chevron]');
    const btn = selectRoot.querySelector('[data-btn]');

    menu.innerHTML = options.map(opt => `
        <li class="px-4 py-2 cursor-pointer transition select-none 
                   bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] 
                   bg-clip-text text-transparent font-medium
                   hover:from-[rgb(var(--button-from))]/70 hover:to-[rgb(var(--button-to))]/70"
            data-value="${opt.value || opt}">
            ${opt.label || opt}
        </li>
    `).join('');

    btn.addEventListener('click', () => {
        const isOpen = !menu.classList.contains('hidden');
        menu.classList.toggle('hidden', isOpen);
        chevron.classList.toggle('rotate-180', !isOpen);
    });

    document.addEventListener('click', e => {
        if (!selectRoot.contains(e.target)) {
            menu.classList.add('hidden');
            chevron.classList.remove('rotate-180');
        }
    });

    menu.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            const val = li.dataset.value;
            const label = li.textContent.trim();

            text.textContent = label;
            text.classList.remove('italic', 'text-[rgb(var(--placeholder-from))]');
            text.classList.add('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'bg-clip-text', 'text-transparent');

            input.value = val;

            menu.classList.add('hidden');
            chevron.classList.remove('rotate-180');
        });
    });

    btn.addEventListener('contextmenu', e => {
        e.preventDefault();
        text.textContent = 'Seleccione una universidad';
        text.classList.add('italic', 'text-[rgb(var(--placeholder-from))]');
        text.classList.remove('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'bg-clip-text', 'text-transparent');
        input.value = '';
    });

    if (selectedValue !== null) {
        const found = options.find(opt => (opt.value || opt) === selectedValue);
        if (found) {
            text.textContent = found.label || found;
            text.classList.remove('italic', 'text-[rgb(var(--placeholder-from))]');
            text.classList.add('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'bg-clip-text', 'text-transparent');
            input.value = selectedValue;
        }
    }
}

function showAddModal() {
    const template = document.querySelector('#tmpl-add-modality');
    if (!template) return;

    const formElement = template.content.querySelector('#modality-form').cloneNode(true);
    Modal.show(formElement);

    const selectRoot = formElement.querySelector('[data-select]');
    const universityOptions = allUniversities.map(u => ({
        value: u.universityID,
        label: u.universityName
    }));
    populateSelect(selectRoot, universityOptions);

    formElement.querySelector('#cancel-btn').addEventListener('click', () => {
        Modal.hide();
    });

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(formElement);
        const data = {
            modalityName: formData.get('modalityName'),
            universityID: formData.get('universityID')
        };

        if (!data.modalityName || !data.universityID) {
            Toast.show('Todos los campos son requeridos', 'warn');
            return;
        }

        try {
            await ModalitiesService.post(data);
            Toast.show('Modalidad creada correctamente', 'success');
            Modal.hide();
            await loadModalities();
        } catch (error) {
            Toast.show('Error al crear la modalidad', 'error');
            console.error(error);
        }
    });
}

function showEditModal(modality) {
    const template = document.querySelector('#tmpl-add-modality');
    if (!template) return;

    const formElement = template.content.querySelector('#modality-form').cloneNode(true);
    
    formElement.querySelector('.text-3xl').textContent = 'Editar modalidad';
    formElement.querySelector('.text-xl').textContent = 'Modifica los campos necesarios';
    
    Modal.show(formElement);

    formElement.querySelector('#modality-name').value = modality.modalityName || '';

    const selectRoot = formElement.querySelector('[data-select]');
    const universityOptions = allUniversities.map(u => ({
        value: u.universityID,
        label: u.universityName
    }));
    populateSelect(selectRoot, universityOptions, modality.universityID);

    formElement.querySelector('#cancel-btn').addEventListener('click', () => {
        Modal.hide();
    });

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(formElement);
        const data = {
            modalityName: formData.get('modalityName'),
            universityID: formData.get('universityID')
        };

        if (!data.modalityName || !data.universityID) {
            Toast.show('Todos los campos son requeridos', 'warn');
            return;
        }

        try {
            await ModalitiesService.put(modality.id, data);
            Toast.show('Modalidad actualizada correctamente', 'success');
            Modal.hide();
            await loadModalities();
        } catch (error) {
            Toast.show('Error al actualizar la modalidad', 'error');
            console.error(error);
        }
    });
}

function showViewModal(modality) {
    const template = document.querySelector('#tmpl-view-modality');
    if (!template) return;

    const viewElement = template.content.cloneNode(true).querySelector('div');
    
    viewElement.querySelector('#view-title').textContent = modality.modalityName || 'Sin nombre';
    viewElement.querySelector('#view-university').textContent = modality.universityName || 'Sin universidad';

    Modal.show(viewElement);

    viewElement.querySelector('#close-view-btn').addEventListener('click', () => {
        Modal.hide();
    });
}

addModalityBtn.addEventListener('click', showAddModal);

await loadUniversities();
await loadModalities();