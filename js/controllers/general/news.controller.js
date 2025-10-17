import { NotificationService } from './../../services/notifications.service';
import { UsersService } from './../../services/users.service';  // Cambiar a UsersService

const notificationList = document.querySelector('#notification-list');
const searchInput = document.querySelector('#notification-search');
const addNotificationBtn = document.querySelector('#add-notification-btn');

let allNotifications = [];
let allUsers = [];

function formatDate(dateString) {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

function populateNotifications(notifications) {
    notificationList.innerHTML = notifications.length ? notifications.map(n => `
        <div class="notification-card w-full p-8 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.005] transition-all duration-300 cursor-pointer flex flex-col" data-id="${n.notificationID}">
            <div class="flex justify-between items-start mb-4">
                <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-2xl">
                    ${n.title || 'Sin título'}
                </h2>
                <span class="inline-block px-4 py-2 text-xs rounded-full bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] text-white font-semibold select-none drop-shadow">
                    ${formatDate(n.sentAt)}
                </span>
            </div>
            <p class="text-base bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent mb-4 line-clamp-2">
                ${n.body || 'Sin contenido'}
            </p>
            <div class="flex items-center gap-2 mt-auto">
                <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span class="text-sm font-medium bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent">
                    ${n.UserName || 'Usuario desconocido'}
                </span>
            </div>
        </div>
    `).join('') : `
        <div class="text-center w-full py-10">
            <span class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow">
                No hay notificaciones registradas.
            </span>
        </div>
    `;

    notificationList.querySelectorAll('.notification-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const notification = allNotifications.find(n => n.notificationID === id);
            ContextMenu.show([
                {
                    label: 'Ver detalles',
                    icon: 'view',
                    onClick: () => showViewModal(notification)
                },
                {
                    label: 'Editar',
                    icon: 'edit',
                    onClick: () => showEditModal(notification)
                },
                {
                    label: 'Eliminar',
                    icon: 'delete',
                    onClick: async () => {
                        const confirmed = await Toast.confirm('¿Estás seguro de eliminar esta notificación?');
                        if (confirmed) {
                            try {
                                await NotificationService.delete(id);
                                Toast.show('Notificación eliminada correctamente', 'success');
                                await loadNotifications();
                            } catch (error) {
                                Toast.show('Error al eliminar la notificación', 'error');
                                console.error(error);
                            }
                        }
                    }
                }
            ]);
        });
    });
}

async function loadNotifications() {
    try {
        allNotifications = await NotificationService.get();
        populateNotifications(allNotifications);
    } catch (error) {
        Toast.show('Error al cargar las notificaciones', 'error');
        console.error(error);
        populateNotifications([]);
    }
}

async function loadUsers() {
    try {
        allUsers = await UsersService.get();  // Cambiar a UsersService
    } catch (error) {
        Toast.show('Error al cargar los usuarios', 'error');
        console.error(error);
        allUsers = [];
    }
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    if (!searchTerm) {
        populateNotifications(allNotifications);
        return;
    }

    const filtered = allNotifications.filter(n =>
        (n.title || '').toLowerCase().includes(searchTerm) ||
        (n.body || '').toLowerCase().includes(searchTerm) ||
        (n.UserName || '').toLowerCase().includes(searchTerm)
    );
    populateNotifications(filtered);
});

function populateSelect(selectRoot, options = [], selectedValue = null) {
    if (!selectRoot) return;

    const menu = selectRoot.querySelector('[data-menu]');
    const text = selectRoot.querySelector('[data-text]');
    const input = selectRoot.querySelector('[data-input]');
    const chevron = selectRoot.querySelector('[data-chevron]');
    const btn = selectRoot.querySelector('[data-btn]');

    menu.innerHTML = options.map(opt => `
        <li class="px-4 py-2 cursor-pointer transition select-none bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent font-medium hover:from-[rgb(var(--button-from))]/70 hover:to-[rgb(var(--button-to))]/70" data-value="${opt.value || opt}">
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
        text.textContent = 'Seleccione un usuario';
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

function showAddModal() {
    const template = document.querySelector('#tmpl-add-notification');
    if (!template) return;

    const formElement = template.content.querySelector('#notification-form').cloneNode(true);
    Modal.show(formElement);

    const selectRoot = formElement.querySelector('[data-select]');
    const userOptions = allUsers.map(u => ({
        value: u.userID,
        label: u.peopleName || u.username || u.email || 'Sin nombre'
    }));
    populateSelect(selectRoot, userOptions);

    // Establecer fecha actual por defecto
    const today = new Date().toISOString().split('T')[0];
    formElement.querySelector('#notification-date').value = today;

    formElement.querySelector('#cancel-btn').addEventListener('click', () => {
        Modal.hide();
    });

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(formElement);
        const data = {
            title: formData.get('title'),
            body: formData.get('body'),
            userID: formData.get('userID'),
            sentAt: formData.get('sentAt')
        };

        if (!data.title || !data.body || !data.userID) {
            Toast.show('Todos los campos son requeridos', 'warn');
            return;
        }

        try {
            await NotificationService.post(data);
            Toast.show('Notificación creada correctamente', 'success');
            Modal.hide();
            await loadNotifications();
        } catch (error) {
            Toast.show('Error al crear la notificación', 'error');
            console.error(error);
        }
    });
}

function showEditModal(notification) {
    const template = document.querySelector('#tmpl-add-notification');
    if (!template) return;

    const formElement = template.content.querySelector('#notification-form').cloneNode(true);
    formElement.querySelector('.text-3xl').textContent = 'Editar notificación';
    formElement.querySelector('.text-xl').textContent = 'Modifica los campos necesarios';
    Modal.show(formElement);

    formElement.querySelector('#notification-title').value = notification.title || '';
    formElement.querySelector('#notification-body').value = notification.body || '';
    formElement.querySelector('#notification-date').value = notification.sentAt || '';

    const selectRoot = formElement.querySelector('[data-select]');
    const userOptions = allUsers.map(u => ({
        value: u.userID,
        label: u.peopleName || u.username || u.email || 'Sin nombre'
    }));
    populateSelect(selectRoot, userOptions, notification.userID);

    formElement.querySelector('#cancel-btn').addEventListener('click', () => {
        Modal.hide();
    });

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(formElement);
        const data = {
            title: formData.get('title'),
            body: formData.get('body'),
            userID: formData.get('userID'),
            sentAt: formData.get('sentAt')
        };

        if (!data.title || !data.body || !data.userID) {
            Toast.show('Todos los campos son requeridos', 'warn');
            return;
        }

        try {
            await NotificationService.put(notification.notificationID, data);
            Toast.show('Notificación actualizada correctamente', 'success');
            Modal.hide();
            await loadNotifications();
        } catch (error) {
            Toast.show('Error al actualizar la notificación', 'error');
            console.error(error);
        }
    });
}

function showViewModal(notification) {
    const template = document.querySelector('#tmpl-view-notification');
    if (!template) return;

    const viewElement = template.content.cloneNode(true).querySelector('div');
    viewElement.querySelector('#view-title').textContent = notification.title || 'Sin título';
    viewElement.querySelector('#view-user').textContent = notification.UserName || 'Usuario desconocido';
    viewElement.querySelector('#view-body').textContent = notification.body || 'Sin contenido';
    viewElement.querySelector('#view-date').textContent = formatDate(notification.sentAt);

    Modal.show(viewElement);

    viewElement.querySelector('#close-view-btn').addEventListener('click', () => {
        Modal.hide();
    });
}

addNotificationBtn.addEventListener('click', showAddModal);

await loadUsers();
await loadNotifications();