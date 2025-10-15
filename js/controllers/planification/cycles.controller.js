import { CycleTypesService } from "../../services/cycle-types.service";


const cyclesList = document.querySelector('#cycles-list');
const user = JSON.parse(sessionStorage.getItem('user'));

function populateCycles(cycles) {
    const filtered = cycles.filter(c => c.universityID === user.universityID);

    cyclesList.innerHTML = filtered.length
        ? filtered.map(cycle => `
                <div class="mb-5">
                    <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] 
                               bg-clip-text text-transparent text-lg">
                        ${cycle.cycleLabel || 'Ciclo sin nombre'}
                    </h2>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] 
                              bg-clip-text text-transparent italic mb-2">
                        Año: ${cycle.universityName || 'No especificado'}
                    </p>
                </div>
                <div>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white 
                                 font-semibold select-none">
                        ID: ${cycle.id || '—'}
                    </span>
                </div>
            </div>
        `).join('')
        : `
            <div class="text-center text-gray-500 w-full py-10">
                No hay ciclos registrados.
            </div>
        `;

    cyclesList.querySelectorAll('[data-id]').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            Toast.show(`Seleccionaste el ciclo con ID: ${id}`, 'info');
        });
    });
}

async function loadCycles() {
    try {
        const data = await CycleTypesService.get();
        console.log('✅ Ciclos recibidos:', data);
        populateCycles(data);
    } catch (error) {
        console.error('❌ Error al cargar ciclos:', error);
        cyclesList.innerHTML = `
            <div class="text-center text-red-500 w-full py-10">
                Error al cargar los ciclos.
            </div>
        `;
        Toast.show('Error al cargar los ciclos', 'error');
    }
}

await loadCycles();