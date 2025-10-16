import { SocialServiceService } from './../../services/social-service.service';
import { UniversityService } from './../../services/universities.service';

const projectList = document.querySelector('#project-list');
const searchInput = document.querySelector('#project-search');
const addProjectBtn = document.querySelector('#add-project-btn');

let allProjects = [];
let allUniversities = [];

function populateProjects(projects) {
    projectList.innerHTML = projects.length
        ? projects.map(p => `
            <div class="project-card p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col min-w-[300px] max-w-[500px]" data-id="${p.socialServiceProjectID}">
                <div class="mb-6">
                    <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-lg mb-2">
                        ${p.socialServiceProjectName || 'Sin nombre'}
                    </h2>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent mb-3">
                        ${p.description || 'Sin descripción'}
                    </p>
                    <span class="inline-block mt-2 px-3 py-1 text-xs rounded bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] text-white font-semibold select-none drop-shadow">
                        ${p.universityName || 'Sin universidad'}
                    </span>
                </div>
            </div>
        `).join('')
        : `
            <div class="text-center w-full py-10">
                <span class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow">
                    No hay proyectos de servicio social registrados.
                </span>
            </div>
        `;

    projectList.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const project = allProjects.find(p => p.socialServiceProjectID === id);
            
            ContextMenu.show([
                {
                    label: 'Ver detalles',
                    icon: 'view',
                    onClick: () => showViewModal(project)
                },
                {
                    label: 'Editar',
                    icon: 'edit',
                    onClick: () => showEditModal(project)
                },
                {
                    label: 'Eliminar',
                    icon: 'delete',
                    onClick: async () => {
                        const confirmed = await Toast.confirm('¿Estás seguro de eliminar este proyecto?');
                        if (confirmed) {
                            try {
                                await SocialServiceService.delete(id);
                                Toast.show('Proyecto eliminado correctamente', 'success');
                                await loadProjects();
                            } catch (error) {
                                Toast.show('Error al eliminar el proyecto', 'error');
                                console.error(error);
                            }
                        }
                    }
                }
            ]);
        });
    });
}

async function loadProjects() {
    try {
        allProjects = await SocialServiceService.get();
        populateProjects(allProjects);
    } catch (error) {
        Toast.show('Error al cargar los proyectos', 'error');
        console.error(error);
        populateProjects([]);
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
        populateProjects(allProjects);
        return;
    }

    const filtered = allProjects.filter(p => 
        (p.socialServiceProjectName || '').toLowerCase().includes(searchTerm) ||
        (p.description || '').toLowerCase().includes(searchTerm) ||
        (p.universityName || '').toLowerCase().includes(searchTerm)
    );

    populateProjects(filtered);
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
    const template = document.querySelector('#tmpl-add-project');
    if (!template) return;

    const formElement = template.content.querySelector('#project-form').cloneNode(true);
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
            socialServiceProjectName: formData.get('socialServiceProjectName'),
            description: formData.get('description'),
            universityID: formData.get('universityID')
        };

        if (!data.socialServiceProjectName || !data.description || !data.universityID) {
            Toast.show('Todos los campos son requeridos', 'warn');
            return;
        }

        try {
            await SocialServiceService.post(data);
            Toast.show('Proyecto creado correctamente', 'success');
            Modal.hide();
            await loadProjects();
        } catch (error) {
            Toast.show('Error al crear el proyecto', 'error');
            console.error(error);
        }
    });
}

function showEditModal(project) {
    const template = document.querySelector('#tmpl-add-project');
    if (!template) return;

    const formElement = template.content.querySelector('#project-form').cloneNode(true);
    
    formElement.querySelector('.text-3xl').textContent = 'Editar proyecto';
    formElement.querySelector('.text-xl').textContent = 'Modifica los campos necesarios';
    
    Modal.show(formElement);

    formElement.querySelector('#project-name').value = project.socialServiceProjectName || '';
    formElement.querySelector('#project-description').value = project.description || '';

    const selectRoot = formElement.querySelector('[data-select]');
    const universityOptions = allUniversities.map(u => ({
        value: u.universityID,
        label: u.universityName
    }));
    populateSelect(selectRoot, universityOptions, project.universityID);

    formElement.querySelector('#cancel-btn').addEventListener('click', () => {
        Modal.hide();
    });

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(formElement);
        const data = {
            socialServiceProjectName: formData.get('socialServiceProjectName'),
            description: formData.get('description'),
            universityID: formData.get('universityID')
        };

        if (!data.socialServiceProjectName || !data.description || !data.universityID) {
            Toast.show('Todos los campos son requeridos', 'warn');
            return;
        }

        try {
            await SocialServiceService.put(project.socialServiceProjectID, data);
            Toast.show('Proyecto actualizado correctamente', 'success');
            Modal.hide();
            await loadProjects();
        } catch (error) {
            Toast.show('Error al actualizar el proyecto', 'error');
            console.error(error);
        }
    });
}

function showViewModal(project) {
    const template = document.querySelector('#tmpl-view-project');
    if (!template) return;

    const viewElement = template.content.cloneNode(true).querySelector('div');
    
    viewElement.querySelector('#view-title').textContent = project.socialServiceProjectName || 'Sin nombre';
    viewElement.querySelector('#view-university').textContent = project.universityName || 'Sin universidad';
    viewElement.querySelector('#view-description').textContent = project.description || 'Sin descripción';

    Modal.show(viewElement);

    viewElement.querySelector('#close-view-btn').addEventListener('click', () => {
        Modal.hide();
    });
}

addProjectBtn.addEventListener('click', showAddModal);

await loadUniversities();
await loadProjects();