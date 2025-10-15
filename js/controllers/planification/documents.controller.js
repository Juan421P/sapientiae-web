import { DocumentsService } from '../../services/documents.service'; // tu servicio de documentos

const documentsList = document.querySelector('#documents-list');
const user = JSON.parse(sessionStorage.getItem('user'));

function populateDocuments(documents) {
    // Filtrar documentos según la universidad del usuario
    const filtered = documents.filter(d => d.universityID === user.universityID);

    documentsList.innerHTML = filtered.length
        ? filtered.map(d => `
            <div class="w-64 p-6 bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-lg shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col justify-between" data-id="${d.id}">
                <h3 class="mb-1 font-semibold text-indigo-700" id="document-name">${d.name}</h3>
                <p class="text-sm text-indigo-500" id="document-description">${d.description || 'Sin descripción'}</p>
            </div>
        `).join('')
        : `
            <div class="text-center text-gray-500 w-full py-10">
                No hay documentos registrados.
            </div>
        `;

    // Agregar listener a cada tarjeta
    documentsList.querySelectorAll('[data-id]').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            // Aquí puedes abrir un modal o menú contextual
            Toast.show(`Seleccionaste el documento con ID: ${id}`);
        });
    });
}

async function loadDocuments() {
    try {
        const data = await DocumentsService.get(); // Traer documentos desde el servicio
        populateDocuments(data);
    } catch (error) {
        console.error('Error cargando documentos:', error);
        Toast.show('No se pudieron cargar los documentos', 'error');
    }
}

// Ejecutar la carga
await loadDocuments();