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
                {
                    label: 'El select',
                    icon: 'view',
                    onClick: async () => {
                        const template = document.querySelector('#select-template');
                        if (!template) return;

                        const selectModal = template.content.querySelector('#select-modal').cloneNode(true);
                        Modal.show(selectModal);

                        const selectRoot = selectModal.querySelector('[data-select]');

                        populateSelect(selectRoot, [
                            { value: 'opt1', label: 'Primera opción' },
                            { value: 'opt2', label: 'Segunda opción' },
                            { value: 'opt3', label: 'Tercera opción' }
                        ]);
                    }
                }
            ]);
        });
    });
}

async function loadUsers() {
    const data = await UsersService.get();
    populateTable(data);
}

function populateSelect(selectRoot, options = [], selectedValue = null) {
    if (!selectRoot) return;

    const menu = selectRoot.querySelector('[data-menu]');
    const text = selectRoot.querySelector('[data-text]');
    const input = selectRoot.querySelector('[data-input]');
    const chevron = selectRoot.querySelector('[data-chevron]');
    const btn = selectRoot.querySelector('[data-btn]');

    menu.innerHTML = options.map(opt => `
        <li class="px-4 py-2 cursor-pointer transition select-none 
                   bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] 
                   bg-clip-text text-transparent font-medium
                   hover:from-[rgb(var(--button-from))]/70 hover:to-[rgb(var(--button-to))]/70"
            data-value="${opt.value || opt}">
            ${opt.label || opt}
        </li>
    `).join('');

    btn.addEventListener('click', () => {
        const isOpen = !menu.classList.contains('hidden');
        menu.classList.toggle('hidden', isOpen);
        chevron.classList.toggle('rotate-180', !isOpen);
    });

    document.addEventListener('click', e => {
        if (!selectRoot.contains(e.target)) {
            menu.classList.add('hidden');
            chevron.classList.remove('rotate-180');
        }
    });

    menu.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            const val = li.dataset.value;
            const label = li.textContent.trim();

            text.textContent = label;

            text.classList.remove('italic', 'text-[rgb(var(--placeholder-from))]');
            text.classList.add('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'bg-clip-text', 'text-transparent');

            input.value = val;

            menu.classList.add('hidden');
            chevron.classList.remove('rotate-180');
        });
    });

    btn.addEventListener('contextmenu', e => {
        e.preventDefault();
        text.textContent = 'Seleccione';
        text.classList.add('italic', 'text-[rgb(var(--placeholder-from))]');
        text.classList.remove('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'bg-clip-text', 'text-transparent');
        input.value = '';
    });

    if (selectedValue !== null) {
        const found = options.find(opt => (opt.value || opt) === selectedValue);
        if (found) {
            text.textContent = found.label || found;
            text.classList.remove('italic', 'text-[rgb(var(--placeholder-from))]');
            text.classList.add('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'bg-clip-text', 'text-transparent');
            input.value = selectedValue;
        }
    }
}


await loadUsers();