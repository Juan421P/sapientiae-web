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

await loadUsers();