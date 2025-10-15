import { DegreeTypesService } from "./../../services/degree-types.service";

const gradeList = document.querySelector('#grades-list');
const user = JSON.parse(sessionStorage.getItem('user'));

function populateGrades(grades) {
    gradeList.innerHTML = grades.length
        ? grades.map(g => `
            <div class="grade-card p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col justify-between" data-id="${g.id} min-w-[300px] max-w-[500px]">
                <div class="mb-5">
                    <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-lg">
                        ${g.degreeTypeName || 'Sin nombre'}
                    </h2>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent italic mb-2">
                        ${g.universityName || 'Sin descripción'}
                    </p>
                    <p class="text-xs bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
                        Nivel académico: ${g.degreeTypeName || 'No especificado'}
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

    // Listeners de las tarjetas
    gradeList.querySelectorAll('.grade-card').forEach(card => {
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
                            await DegreeTypesService.delete(id);
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

async function loadGrades() {
    const data = await DegreeTypesService.get();
    populateGrades(data);
}

await loadGrades();