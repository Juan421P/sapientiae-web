import { DocumentsService } from "../../services/documents.service";

const documentsList = document.querySelector('#documents-list');
const user = JSON.parse(sessionStorage.getItem('user'));

function populateDocuments(documents) {
    documentsList.innerHTML = documents.length
        ? documents.map(d => `
            <div class="document-card min-w-[300px] max-w-[500px] p-6 bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] rounded-lg shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col justify-between" data-id="${d.id}">
                <h3 class="mb-1 font-semibold text-indigo-700" id="document-name">${d.documentName}</h3>
                <p class="text-sm text-indigo-500" id="document-description">${d.documentCategory || 'Sin descripción'}</p>
            </div>
        `).join('')
        : `
            <div class="text-center text-gray-500 w-full py-10">
                No hay documentos registrados.
            </div>
        `;
    documentsList.querySelectorAll('.document-card').forEach(card => {
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
                            await DocumentsService.delete(id);
                            Toast.show('Ciclo eliminado', 'error');
                            await loadDocuments();
                        } catch {
                            Toast.show('Error al eliminar', 'error');
                        }
                    }
                }
            ]);
        });
    });
}

async function loadDocuments() {
    const data = await DocumentsService.get(); // Traer documentos desde el servicio
    populateDocuments(data);
}

// Ejecutar la carga
await loadDocuments();