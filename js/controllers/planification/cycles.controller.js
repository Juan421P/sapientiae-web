import { CycleTypesService } from "../../services/cycle-types.service";

const cyclesList = document.querySelector('#cycles-list');
const user = JSON.parse(sessionStorage.getItem('user'));

function populateCycles(cycles) {
    const filtered = cycles.filter(c => c.universityID === user.universityID);

    cyclesList.innerHTML = filtered.length
        ? filtered.map(cycle => `
            <div 
                class="cycle-card bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] 
                       rounded-lg shadow p-6 flex flex-col justify-between cursor-pointer 
                       hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 min-w-[300px] max-w-[500px]"
                data-id="${cycle.id}"
            >
                <h2 class="text-md font-bold text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent italic mb-2">
                    ID: ${cycle.universityID || 'Ciclo sin nombre'}
                </h3>
                <p class="text-md font-bold text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent italic mb-2">
                    Ciclo: ${cycle.cycleLabel || '—'}
                </p>
                <p class="text-md font-bold text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent italic mb-2">
                    Universidad: ${cycle.universityName || '—'}
                </p>
            </div>
        `).join('')
        : `
            <div class="text-center w-full py-10">
                <span class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] 
                             bg-clip-text text-transparent drop-shadow">
                    No hay ciclos registrados.
                </span>
            </div>
        `;

    // --- Eventos por tarjeta ---
    cyclesList.querySelectorAll('.cycle-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            ContextMenu.show([
                {
                    label: 'Hola',
                    icon: 'view',
                    onClick: () => {
                        Toast.show('hola', 'info');
                    }
                },
                {
                    label: 'Editar',
                    icon: 'edit',
                    onClick: () =>{
                        Toast.show('Editando cosa', 'warn')
                    }
                },
                {
                    label: 'Eliminar',
                    icon: 'trash',
                    onClick: async () => {
                        try {
                            await CycleTypesService.delete(id);
                            Toast.show('Ciclo eliminado', 'error');
                            await loadCycles();
                        } catch {
                            Toast.show('Error al eliminar', 'error');
                        }
                    }
                }
            ]);
        });
    });
}

// --- Función asíncrona para cargar ciclos ---
async function loadCycles() {
    const data = await CycleTypesService.get();
    populateCycles(data);
}

async function insertCycle(data){
    const json = await CycleTypesService.post(data);
    await loadCycles();
}

// --- Inicialización ---
await loadCycles();
