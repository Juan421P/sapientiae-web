import { DegreeTypesService } from "./../../services/degree-types.service";

const gradeList = document.querySelector('#grades-list');
const user = JSON.parse(sessionStorage.getItem('user'));

function populateGrades(grades) {
    const filtered = grades.filter(g => g.universityID === user.universityID);

    gradeList.innerHTML = filtered.length
        ? filtered.map(g => `
            <div class="w-64 p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col justify-between" data-id="${g.id}">
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
    gradeList.querySelectorAll('[data-id]').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            Toast.show(`Seleccionaste el grado con ID: ${id}`);
        });
    });
}

async function loadGrades() {
    try {
        const data = await DegreeTypesService.get();
        console.log('✅ Grados recibidos:', data);
        populateGrades(data);
    } catch (error) {
        console.error('❌ Error al cargar grados:', error);
        gradeList.innerHTML = `
            <div class="text-center text-red-500 w-full py-10">
                Error al cargar los grados.
            </div>
        `;
    }
}

await loadGrades();