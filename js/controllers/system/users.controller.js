import { UsersService } from './../../services/users.service';

const thead = document.querySelector('#thead');
const tbody = document.querySelector('#tbody');
const headers = [
    'Nombre',
    'Correo',
    'Rol'
];

thead.innerHTML = `
    <tr class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] drop-shadow-sm">
        ${headers.map(h => `
            <th class="px-5 py-4 text-left select-none text-white drop-shadow-sm">
                ${h}
            </th>
        `).join('')}
    </tr>
`;

const user = JSON.parse(sessionStorage.getItem('user'));

function populateTable(users) {
    const filtered = users.filter(u => u.universityID === user.universityID);

    tbody.innerHTML = filtered.length ? filtered.map(u => `
        <tr class="trow group hover:bg-gradient-to-r hover:from-[rgb(var(--button-from))] hover:to-[rgb(var(--button-to))] transition-colors cursor-pointer duration-150 group drop-shadow-sm" data-id="${u.id}">
            <td class="px-5 py-4 text-[rgb(var(--button-from))] group-hover:text-[rgb(var(--card-from))] drop-shadow-xl">
                ${u.personName} ${u.personLastName}
            </td>
            <td class="px-5 py-4 text-[rgb(var(--button-from))] group-hover:text-[rgb(var(--card-from))] drop-shadow-xl">
                ${u.email}
            </td>
            <td class="px-5 py-4 text-[rgb(var(--button-from))] group-hover:text-[rgb(var(--card-from))] drop-shadow-xl">
                ${u.rolesName}
            </td>
        </tr>
      `).join('') : `
        <tr>
            <td class="px-5 py-4 text-center" colspan="${headers.length}">
                Sin datos
            </td>
        </tr>
    `;

    tbody.querySelectorAll('.trow').forEach(r => {
        r.addEventListener('click', e => {
            const id = r.dataset.id;
            ContextMenu.show([
                {
                    label: 'Ver perfil',
                    icon: 'view',
                    onClick: () => {
                        Toast.show('Ver perfil');
                    },
                },
                {
                    label: 'Editar usuario',
                    icon: 'edit',
                    onClick: () => {
                        Toast.show('Editar usuario', 'warn');
                    },
                },
                {
                    label: 'Eliminar usuario',
                    icon: 'delete',
                    onClick: () => {
                        Toast.show('Eliminar usuario', 'error');
                    },
                },
            ]);
        });
    });
}

async function loadUsers() {
    const data = await UsersService.get();
    populateTable(data);
}

const deleteMesage = `
    <template id="delete-template">
        <div class="flex flex-col gap-10 p-10 mx-auto" id="delete-modal">
            <div class="text-left">
                <span
                    class="min-w-full text-3xl font-bold bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent drop-shadow select-none text-left">
                    ¿Seguro que desea eliminar a este usuario?
                </span>
                <p
                    class="mt-2 font-semibold text-sm bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent select-none text-left">
                    No podra revertir los cambios.
                </p>
            </div>
            <div class="flex justify-end gap-4">
                <div id="delete-confirm" class="group">
                    <button type="button" class="secondary-btn-component" id="delete-confirm">
                        <div class="flex justify-center w-full">
                            <span id="button-text" class="drop-shadow-sm">
                                Confirmar
                            </span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </template>`
;

async function deleteUser(id) {
    
    
}

await loadUsers();

