import { FacultiesService } from './../../services/faculties.service';
import { DepartmentsService } from '../../services/departments.service';

const departmentList = document.querySelector('#department-list');
const addDepartmentBtn = document.querySelector('#add-department-btn');
const user = JSON.parse(sessionStorage.getItem('user'));

const departments = await DepartmentsService.get();
const faculties = await FacultiesService.get();
const data = DataOperations.join([
    {
        alias: 'd',
        data: departments,
        key: 'facultyID'
    },
    {
        alias: 'f',
        data: faculties,
        foreignKey: 'facultyID',
        key: 'facultyID'
    }
], {
    type: 'inner'
});
console.log(data);

function populateDepartments() {
    departmentList.innerHTML = data.length
        ? data.map(d => `
            <div class="department-card min-w-[400px] max-w-[600px] p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] 
                        rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col justify-between"
                 data-id="${d.d_departmentID}">
                <div class="mb-10">
                    <h2 id="departmentName" class="font-bold text-lg">
                        <span class="bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
                            ${d.d_departmentName}
                        </span>
                    </h2>
<<<<<<< HEAD
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
                        Facultad: ${d.faculty}
=======
                    <p class="text-sm italic">
                        <span class="bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
                            ${d.f_facultyName}
                        </span>
>>>>>>> 2ad5b01 (por petición popular, hago push del easter egg navideño. Úsenlo bajo su propia responsabilidad)
                    </p>
                </div>
                <div>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-[rgb(var(--button-from))] text-white font-semibold select-none">
                        ${d.d_departmentType}
                    </span>
                </div>
            </div>
        `).join('')
        : `
            <div class="text-center w-full py-10">
                <span class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow">
                    No hay departamentos registrados.
                </span>
            </div>
        `;

    departmentList.querySelectorAll('.department-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const d = DataOperations.getById(data, 'd_departmentID', id)
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
                    icon: 'delete',
                    onClick: async () => {
                        try {
                            if (await Toast.confirm('¿Seguro que desea eliminar este ciclo?')) {
                                await DepartmentsService.delete(id);
                                Toast.show('Ciclo eliminado', 'error');
                                await loadDepartments();
                            }
                        } catch {
                            Toast.show('Error al eliminar', 'error');
                        }
                    }
                }
            ]);
        });
    });
}

populateDepartments();