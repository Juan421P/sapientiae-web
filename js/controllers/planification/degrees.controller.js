import { DegreeTypesService } from "./../../services/degree-types.service";
import { UniversityService } from "../../services/universities.service";

const gradeList = document.querySelector('#grades-list');
const user = JSON.parse(sessionStorage.getItem('user'));
const addDegreeBtn = document.querySelector('#add-degree')

let allDegrees = [];
let allUniversities = [];

function populateGrades(grades) {
    gradeList.innerHTML = grades.length
        ? grades.map(g => `
            <div class="grade-card p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col justify-between" data-id="${g.id}">
                <div class="mb-5">
                    <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-lg m-b5">
                        ${g.degreeTypeName || 'Sin nombre'}
                    </h2>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent italic mb-2 mt-3">
                        Universidad: ${g.universityName || 'Sin descripción'}
                    </p>
                </div>
                <div>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">
                        ${g.shortName || 'Grado'}
                    </span>
                </div>
            </div>
        `).join('')
        : `
            <div class="text-center text-gray-500 w-full py-10">
                No hay grados registrados.
            </div>
        `;

    gradeList.querySelectorAll('.grade-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const grade = allDegrees.find(m => String(m.id).trim().toUpperCase() === String(id).trim().toUpperCase());
            ContextMenu.show([
                {
                    label: 'Ver detalles',
                    icon: 'view',
                    onClick: () => showViewDegree(grade)
                },
                {
                    label: 'Editar',
                    icon: 'edit',
                    onClick: () => showEditDegree(grade)
                },
                {
                    label: 'Eliminar',
                    icon: 'delete',
                    onClick: async () => { 
                        try {
                            await DegreeTypesService.delete(id);
                            console.log(id);
                            Toast.show('Ciclo eliminado', 'error');
                            await loadGrades();
                        } catch {
                            Toast.show('Error al eliminar', 'error');
                        }
                    }
                }
            ]);
        });
    });
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

function showAddDegree() {
    const template = document.querySelector('#tmpl-add-grade');
    if (!template) return;

    const formElement = template.content.querySelector('#grade-form').cloneNode(true);
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
        degreeTypeName: formData.get('degreeTypeName'),
        universityID: formData.get('universityID')
    };

    if (!data.degreeTypeName || !data.universityID) {
        Toast.show('Todos los campos son requeridos', 'warn');
        return;
    }

    try {
        await DegreeTypesService.post(data);
        Toast.show('Grado actualizado correctamente', 'success');
        Modal.hide();
        await loadGrades();
    } catch (error) {
        Toast.show('Error al actualizar el grado', 'error');
        console.error(error);
    }
});
}

function showEditDegree(grade) {
    const template = document.querySelector('#tmpl-add-grade');
    if (!template) return;

    const formElement = template.content.querySelector('#grade-form').cloneNode(true);

    formElement.querySelector('.text-3xl').textContent = 'Editar grado';
    formElement.querySelector('.text-xl').textContent = 'Modifica los campos necesarios';

    Modal.show(formElement);

    formElement.querySelector('#universityID').value = grade.universityID || '';
    formElement.querySelector('#degreeTypeName').value = grade.degreeTypeName || '';

    const selectRoot = formElement.querySelector('[data-select]');
    const universityOptions = allUniversities.map(u => ({
        value: u.universityID,
        label: u.universityName
    }));
    populateSelect(selectRoot, universityOptions, grade.universityID);

    formElement.querySelector('#cancel-btn').addEventListener('click', () => {
        Modal.hide();
    });

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(formElement);
        const data = {
            degreeTypeName: formData.get('degreeTypeName'),
            universityID: formData.get('universityID')
        };

        if (!data.degreeTypeName || !data.universityID) {
            Toast.show('Todos los campos son requeridos', 'warn');
            return;
        }

        try {
            await DegreeTypesService.put(grade.id, data);
            Toast.show('Grado actualizado correctamente', 'success');
            Modal.hide();
            await loadGrades();
        } catch (error) {
            Toast.show('Error al actualizar el grado', 'error');
            console.error(error);
        }
    });
}

function showViewDegree(grade) {
    const template = document.querySelector('#tmpl-view-grade');
    if (!template) return;

    const viewElement = template.content.cloneNode(true).querySelector('div');

    viewElement.querySelector('#view-degree-name').textContent = grade.degreeTypeName || 'Sin nombre';
    viewElement.querySelector('#view-university').textContent = grade.universityName || 'Sin universidad';
    viewElement.querySelector('#view-universityID').textContent = grade.universityID || 'Sin ID';

    Modal.show(viewElement);

    viewElement.querySelector('#close-view-btn').addEventListener('click', () => {
        Modal.hide();
    });
}

addDegreeBtn.addEventListener('click', showAddDegree);

async function loadGrades() {
    const data = await DegreeTypesService.get();
    allDegrees = data;
    populateGrades(allDegrees);
}

await loadUniversities();
await loadGrades();