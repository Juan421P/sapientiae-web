import { buildInitials } from './../../lib/common.js';

const currentuser = JSON.parse(sessionStorage.getItem('user') || '{}');

function renderAvatar() {
    const host = document.querySelector('#profile-avatar-main');
    if (!host) return;

    host.innerHTML = '';
    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

    if (user.image) {
        const img = document.createElement('img');
        img.src = user.image;
        img.className = 'object-cover rounded-full hover:cursor-pointer';
        img.onerror = () => host.appendChild(buildInitials(initials || '?'));
        host.appendChild(img);
    } else {
        host.appendChild(buildInitials(initials || '?'));
    }
}

function renderUserInfo() {
    const nameEl = document.querySelector('#profile-name');
    const roleEl = document.querySelector('#main-role');
    const emailEl = document.querySelector('#main-email');

    if (nameEl) nameEl.textContent = `${user.firstName} ${user.lastName}`.trim();
    if (roleEl) roleEl.textContent = user.roleID || 'Usuario';
    if (emailEl) emailEl.textContent = user.email || '';

    renderAvatar();
}

document.addEventListener('DOMContentLoaded', () => {
    renderUserInfo();
});


const user = JSON.parse(sessionStorage.getItem('user') || '{}');
console.log(user);