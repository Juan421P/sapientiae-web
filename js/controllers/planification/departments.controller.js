import { DepartmentsService } from '../../services/departments.service';

const departmentList = document.querySelector('#department-list');
const addDepartmentBtn = document.querySelector('#add-department-btn');
const user = JSON.parse(sessionStorage.getItem('user'));

function populateDepartments(departments) {
    const filtered = departments.filter(d => d.universityID === user.universityID);

    departmentList.innerHTML = filtered.length
        ? filtered.map(d => `
            <div class="w-72 p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] 
                        rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col justify-between"
                 data-id="${d.id}">
                 
                <div class="mb-10">
                    <h2 id="departmentName" class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] 
                        bg-clip-text text-transparent text-lg">
                        ${d.departmentName}
                    </h2>
                    <p id="departmentCode" class="text-md font-bold text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] 
                        bg-clip-text text-transparent italic mb-2">
                        ID ${d.departmentCode}
                    </p>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
                        Facultad: ${d.facultyName || 'Sin asignar'}
                    </p>
                </div>
                <div>
                    <span class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-indigo-400 text-white font-semibold select-none">
                        ${d.universityName || 'Universidad'}
                    </span>
                </div>
            </div>
        `).join('')
        : `
            <div class="text-center text-gray-500 w-full py-10">
                No hay departamentos registrados.
            </div>
        `;

    // Eventos click en cada tarjeta
    departmentList.querySelectorAll('[data-id]').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            Toast.show(`Seleccionaste el departamento con ID: ${id}`);
            // Aquí podrías abrir un modal o menú contextual si quieres
        });
    });
}

/*
// Botón de agregar departamento
addDepartmentBtn.addEventListener('click', () => {
    Toast.show('Abrir formulario de nuevo departamento');
    // Aquí podrías mostrar un <template> con el formulario de agregar
});
*/

// Cargar departamentos
async function loadDepartments() {
    try {
        const data = await DepartmentsService.get();
        populateDepartments(data);
    } catch (error) {
        console.error('Error cargando departamentos:', error);
        Toast.show('No se pudieron cargar los departamentos', 'error');
    }
}

// Ejecutar
await loadDepartments();