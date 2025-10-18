import { CycleTypesService } from "../../services/cycle-types.service";

const cyclesList = document.querySelector('#cycles-list');
const user = JSON.parse(sessionStorage.getItem('user'));

function populateCycles(cycles) {
    const filtered = cycles.filter(c => c.universityID === user.universityID);

    cyclesList.innerHTML = filtered.length
        ? filtered.map(c => `
            <div class="cycle-card p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col min-w-[300px] max-w-[500px]" data-id="${c.id}">
                <div class="mb-5">
                    <h2 class="font-bold text-xl">
                        <span class="bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
                            ${c.cycleLabel || ''}
                        </span>
                    </h2>
                </div>
                <h2 class="text-md font-bold text-xs bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent italic mb-2">
                    ${c.universityName || ''}
                </h2>
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
                    onClick: () => {
                        Toast.show('Editando cosa', 'warn')
                    }
                },
                {
                    label: 'Eliminar',
                    icon: 'delete',
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
async function loadCycles() {
    const data = await CycleTypesService.get();
    populateCycles(data);
}

async function insertCycle(data) {
    const json = await CycleTypesService.post(data);
    await loadCycles();
}

await loadCycles();