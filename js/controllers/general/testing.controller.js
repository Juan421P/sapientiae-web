import { UsersService } from "../../services/users.service";

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
        <tr class="group hover:bg-gradient-to-r hover:from-[rgb(var(--button-from))] hover:to-[rgb(var(--button-to))] transition-colors cursor-pointer duration-150 group drop-shadow-sm">
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
}

async function loadUsers() {
    const data = await UsersService.get();
    populateTable(data);
}

await loadUsers();