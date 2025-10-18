import { DepartmentsService } from '../../services/departments.service';

const departmentList = document.querySelector('#department-list');
const addDepartmentBtn = document.querySelector('#add-department-btn');
const user = JSON.parse(sessionStorage.getItem('user'));

function populateDepartments(departments) {
    departmentList.innerHTML = departments.length
        ? departments.map(d => `
            <div class="department-card min-w-[300px] max-w-[500px] p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] 
                        rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col justify-between"
                 data-id="${d.id}">
                <div class="mb-10">
                    <h2 id="departmentName" class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] 
                        bg-clip-text text-transparent text-lg">
                        ${d.departmentName}
                    </h2>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
                        Facultad: ${d.faculty}
                    </p>
                </div>
                <div>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">
                        ${d.departmentType || 'Universidad'}
                    </span>
                </div>
            </div>
        `).join('')
        : `
            <div class="text-center text-gray-500 w-full py-10">
                No hay departamentos registrados.
            </div>
        `;

    departmentList.querySelectorAll('.department-card').forEach(card => {
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
                            await DepartmentsService.delete(id);
                            Toast.show('Ciclo eliminado', 'error');
                            await loadDepartments();
                        } catch {
                            Toast.show('Error al eliminar', 'error');
                        }
                    }
                }
            ]);
        });
    });
}

async function loadDepartments() {
    const data = await DepartmentsService.get();
    populateDepartments(data);
}

await loadDepartments();