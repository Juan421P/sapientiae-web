import { EvaluationInstrumentsService } from "../../services/evaluation-instruments.service";

const instrumentsList = document.querySelector('#instruments-list');
const user = JSON.parse(sessionStorage.getItem('user'));

function populateInstruments(instruments) {
    const filtered = instruments.filter(c => c.universityID === user.universityID);

    instrumentsList.innerHTML = instruments.length
        ? instruments.map(i => `
            <div 
                class="instrument-card bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] 
                       rounded-lg shadow p-6 min-w-[300px] max-w-[500px] cursor-pointer hover:shadow-lg hover:scale-[1.015] 
                       transition-transform duration-300"
                data-id="${i.instrumentTypeID}"
            >
                <h3 class="mb-1 font-semibold text-indigo-700">
                    ${i.description || 'Sin nombre'}
                </h3>
                <p class="text-sm text-indigo-500">
                    Tipo: ${i.usesRubric || 'No especificado'}
                </p>
            </div>
        `).join('')
        : `
            <div class="text-center w-full py-10">
                <span class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] 
                             bg-clip-text text-transparent drop-shadow">
                    No hay instrumentos registrados.
                </span>
            </div>
        `;

    // --- Eventos por tarjeta ---
    instrumentsList.querySelectorAll('.instrument-card').forEach(card => {
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
                            await EvaluationInstrumentsService.delete(id);
                            Toast.show('Ciclo eliminado', 'error');
                            await loadInstruments();
                        } catch {
                            Toast.show('Error al eliminar', 'error');
                        }
                    }
                }
            ]);
        });
    });
}

// --- Función asíncrona para cargar instrumentos ---
async function loadInstruments() {
    const data = await EvaluationInstrumentsService.get();
    populateInstruments(data);
}

// --- Inicialización ---
await loadInstruments();