import { CareersService } from './../../services/careers.service';

const careerList = document.querySelector('#career-list');
const user = JSON.parse(sessionStorage.getItem('user'));

function populateCareers(careers) {
    const filtered = careers.filter(c => c.universityID === user.universityID);

    careerList.innerHTML = filtered.length
        ? filtered.map(c => `
            <div class="w-72 p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col justify-between" data-id="${c.id}">
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
                <div>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">
                        ${c.departmentName || 'Departamento'}
                    </span>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">
                        ${c.facultyName || 'Facultad'}
                    </span>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">
                        ${c.location || 'Localidad'}
                    </span>
                </div>
            </div>
        `).join('')
        : `
            <div class="text-center text-gray-500 w-full py-10">
                No hay carreras registradas.
            </div>
        `;

    careerList.querySelectorAll('[data-id]').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            Toast.show(`Seleccionaste la carrera con ID: ${id}`);
        });
    });
}

async function loadCareers() {
        const careers = await CareersService.get();
        populateCareers(careers);
}

await loadCareers();