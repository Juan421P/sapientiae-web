import { EvaluationInstrumentsService } from "../../services/evaluation-instruments.service";

const instrumentList = document.querySelector('#instruments-list'); // sección donde irán las tarjetas
const template = document.querySelector('#tmpl-instrument-card');
const user = JSON.parse(sessionStorage.getItem('user')); // si quieres filtrar por universidad

function populateInstruments(instruments) {
    const filtered = instruments.filter(i => i.universityID === user.universityID);

    instrumentList.innerHTML = ''; // limpiar antes de renderizar

    if (filtered.length === 0) {
        const div = document.createElement('div');
        div.className = 'text-center text-gray-500 w-full py-10';
        div.textContent = 'No hay instrumentos registrados.';
        instrumentList.appendChild(div);
        return;
    }

    filtered.forEach(i => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('div');
        card.dataset.id = i.id;
        card.classList.add('instrument-card'); // opcional para seleccionar más tarde

        clone.querySelector('#instrument-name').textContent = i.name;
        clone.querySelector('#instrument-type').textContent = i.type || 'Tipo no especificado';

        // Listener de click
        card.addEventListener('click', () => {
            Toast.show(`Seleccionaste el instrumento con ID: ${i.id}`);
        });

        instrumentList.appendChild(clone);
    });
}

// Cargar los instrumentos desde el servicio
async function loadInstruments() {
    const data = await EvaluationInstrumentsService.get();
    populateInstruments(data);
}

// Inicializar
await loadInstruments();