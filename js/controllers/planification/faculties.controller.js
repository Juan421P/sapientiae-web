import { FacultiesService } from "../../services/faculties.service";

const localitiesList = document.querySelector('#localities-list');
const user = JSON.parse(sessionStorage.getItem('user')); // para filtrar por universidad, si aplica

function populateLocalities(localities) {
    // Filtrar solo los que pertenecen a la misma universidad del usuario
    const filtered = localities.filter(l => l.universityID === user.universityID);

    localitiesList.innerHTML = filtered.length
        ? filtered.map(l => `
            <div class="bg-gradient-to-tr from-indigo-50 to-blue-50 rounded-lg shadow p-6 w-80 flex flex-col justify-between cursor-pointer hover:shadow-lg hover:scale-[1.015] transition-transform duration-300" data-id="${l.id}">
                <h3 class="font-semibold text-indigo-700 mb-1" id="locality-address">${l.address}</h3>
                <p class="text-sm text-indigo-500 mb-1">Teléfono: <span id="locality-phone">${l.phone || 'No asignado'}</span></p>
                <div class="mt-4">
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none ${l.isMain ? '' : 'hidden'}">
                        Sede principal
                    </span>
                </div>
            </div>
        `).join('')
        : `
            <div class="text-center text-gray-500 w-full py-10">
                No hay localidades registradas.
            </div>
        `;

    // Agregar listener a cada tarjeta
    localitiesList.querySelectorAll('[data-id]').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            // Aquí puedes abrir modal, menú contextual, editar, etc.
            Toast.show(`Seleccionaste la localidad con ID: ${id}`);
        });
    });
}

async function loadLocalities() {
    const data = await FacultiesService.get(); // método que devuelve las localidades
    populateLocalities(data);
}

// Carga inicial
await loadLocalities();