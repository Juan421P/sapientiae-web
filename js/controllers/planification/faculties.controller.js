import { FacultiesService } from "../../services/faculties.service";

const careerList = document.querySelector('#career-list');
const user = JSON.parse(sessionStorage.getItem('user'));

// --- Renderizado dinámico de facultades ---
function populateCareers(faculties) {
    const filtered = faculties.filter(c => c.universityID === user.universityID);

    // Renderizar el contenido dinámicamente
    careerList.innerHTML = faculties.length
        ? faculties.map(c => `
            <div class="career-card min-w-[300px] max-w-[500px] p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] 
                       rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 
                       cursor-pointer flex flex-col justify-between" 
                data-id="${c.facultyID}">
                <div class="mb-10">
                    <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] 
                               bg-clip-text text-transparent text-lg">
                        ${c.facultyName}
                    </h2>
                    <p class="text-md font-bold text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] 
                        bg-clip-text text-transparent italic mb-2 mt-5">
                        ID: ${c.facultyID || '—'}
                    </p>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] 
                              bg-clip-text text-transparent mb-2">
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

    // --- Eventos por tarjeta ---
    careerList.querySelectorAll('.career-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;

            ContextMenu.show([
                {
                    label: 'Ver detalles',
                    icon: 'view',
                    onClick: () => Toast.show(`Mostrando detalles de la facultad #${id}`, 'info')
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

// --- Cargar los datos desde el servicio ---
async function loadCareers() {
    const data = await FacultiesService.get();
    populateCareers(data);
}

// --- Inicialización ---
await loadCareers();