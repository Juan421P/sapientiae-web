
import { SystemRolesService } from "../../services/system-roles.service";

const thead = document.querySelector('#thead');
const tbody = document.querySelector('#tbody');
const headers = [
    'Roles dentro del sistema'
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

const rol = JSON.parse(sessionStorage.getItem('roleName'));

function populateTable(roles) {
    tbody.innerHTML = roles.length ? roles.map(u => `
        <tr class="trow group hover:bg-gradient-to-r hover:from-[rgb(var(--button-from))] hover:to-[rgb(var(--button-to))] transition-colors cursor-pointer duration-150 group drop-shadow-sm" data-id="${u.id}">
            <td class="px-5 py-4 text-[rgb(var(--button-from))] group-hover:text-[rgb(var(--card-from))] drop-shadow-xl">
                ${u.roleName}
            </td>
        </tr>
    `).join('') : `
        <tr>
            <td class="px-5 py-4 text-center" colspan="${headers.length}">
                Sin datos
            </td>
        </tr>
    `;

    tbody.querySelector('.trow').forEach(r => {
        r.addEventListener('click', e => {
            const id = r.dataset.id;
            ContextMenu.show([
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
            ])
        })
    })
}

async function loadRoles() {
    const data = await SystemRolesService.get();
    populateTable(data);
}
await loadRoles();

