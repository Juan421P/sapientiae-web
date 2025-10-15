import { CareersService } from './../../services/careers.service';

const careerList = document.querySelector('#career-list');
const user = JSON.parse(sessionStorage.getItem('user'));

function populateCareers(careers) {
    careerList.innerHTML = careers.length
        ? careers.map(c => `
            <div class="career-card p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col min-w-[300px] max-w-[500px]" data-id="${c.id}">
                <div class="mb-10">
                    <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-lg">
                        ${c.name || 'Sin nombre'}
                    </h2>
                    <p class="text-md font-bold text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent italic mb-2">
                        ${c.careerCode || ''}
                    </p>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent mb-2">
                        ${c.description || 'Sin descripción'}
                    </p>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
                        Puntaje mínimo: ${c.minPassingScore || 'N/A'}
                    </p>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
                        Unidades valorativas: ${c.totalValueUnits || 'N/A'}
                    </p>
                </div>
                <!--
                <div>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-[rgb(var(--card-from))] text-[rgb(var(--card-from))] font-semibold select-none">
                        ${c.departmentName || 'Departamento'}
                    </span>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-[rgb(var(--button-from))] text-[rgb(var(--card-from))] font-semibold select-none">
                        ${c.facultyName || 'Facultad'}
                    </span>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-[rgb(var(--button-from))] text-[rgb(var(--card-from))] font-semibold select-none">
                        ${c.location || 'Localidad'}
                    </span>
                </div>
                -->
            </div>
        `).join('')
        : `
            <div class="text-center w-full py-10">
                <span class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow">
                    No hay carreras registradas.
                </span>
            </div>
        `;

    careerList.querySelectorAll('.career-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            ContextMenu.show([
                {
                    label: 'hola',
                    icon: 'view',
                    onClick: () => {
                        Toast.show('hola', 'info');
                    }
                },
                {
                    label: 'Eliminar',
                    icon: 'trash',
                    onClick: async () => {
                        try {
                            await CareersService.delete(id);
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

async function loadCareers() {
    const careers = await CareersService.get();
    console.log(careers);
    populateCareers(careers);
}

await loadCareers();