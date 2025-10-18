import { FacultiesService } from "../../services/faculties.service";

const facultyList = document.querySelector('#faculties-list');
const user = JSON.parse(sessionStorage.getItem('user'));

let allFaculties = [];

function populateCareers(faculties) {
    facultyList.innerHTML = faculties.length
        ? faculties.map(c => `
            <div class="faculty-card min-w-[300px] max-w-[500px] p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] 
                       rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 
                       cursor-pointer flex flex-col justify-between" 
                data-id="${c.facultyID}">
                <div class="mb-10">
                    <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] 
                               bg-clip-text text-transparent text-lg">
                        ${c.facultyName}
                    </h2>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] 
                              bg-clip-text text-transparent mt-4">
                        Telefono de contacto: ${c.contactPhone || 'Sin descripción'}
                    </p>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] 
                              bg-clip-text text-transparent">
                        Codigo Correlativo: ${c.correlativeCode ?? 'N/A'}
                    </p>
                </div>

                <!--
                <div class="flex flex-wrap gap-2">
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">
                        ${c.departmentName || 'Departamento'}
                    </span>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">
                        ${c.facultyName || 'Facultad'}
                    </span>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">
                        ${c.location || 'Localidad'}
                    </span>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">
                        ${c.pensumName || 'Pensum'}
                    </span>
                </div>
                -->
            </div>
        `).join('')
        : `
            <div class="text-center w-full py-10">
                <span class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] 
                             bg-clip-text text-transparent drop-shadow">
                    No hay facultades registradas.
                </span>
            </div>
        `;

    facultyList.querySelectorAll('.faculty-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const faculty = allFaculties.find(m => String(m.id).trim().toUpperCase() === String(id).trim().toUpperCase());
            ContextMenu.show([
                {
                    label: 'Ver detalles',
                    icon: 'view',
                    onClick: () => showViewFaculty(faculty)
                },
                {
                    label: 'Editar',
                    icon: 'edit',
                    onClick: () => Toast.show(`Editar facultad #${id}`, 'info')
                },
                {
                    label: 'Eliminar',
                    icon: 'trash',
                    onClick: async () => {
                        try {
                            await FacultiesService.delete(id);
                            Toast.show('Ciclo eliminado', 'error');
                            await loadCareers();
                        } catch {
                            Toast.show('Error al eliminar', 'error');
                        }
                    }
                }
            ]);
        });
    });
}

function showViewFaculty(faculty) {
    const template = document.querySelector('#tmpl-view-faculty');
    if (!template) return;

    const viewElement = template.content.cloneNode(true).querySelector('div');

    viewElement.querySelector('#view-faculty-name').textContent = faculty.facultyName || 'Sin nombre';
    viewElement.querySelector('#view-faculty-id').textContent = faculty.facultyID || '—';
    viewElement.querySelector('#view-faculty-phone').textContent = faculty.contactPhone || 'Sin teléfono';
    viewElement.querySelector('#view-faculty-code').textContent = faculty.correlativeCode ?? 'N/A';

    Modal.show(viewElement);

    viewElement.querySelector('#close-faculty-view-btn').addEventListener('click', () => {
        Modal.hide();
    });
}

// Ejemplo de uso
document.querySelectorAll('.career-card').forEach(card => {
    card.addEventListener('click', () => {
        const id = card.dataset.id;
        const faculty = allFaculties.find(f => f.facultyID === id);
        if(faculty) showViewFaculty(faculty);
    });
});

async function loadCareers() {
    const data = await FacultiesService.get();
    populateCareers(data);
}

await loadCareers();