import { buildInitials } from '../../lib/common';
import { AuthService } from '../../services/auth.service';

const user = JSON.parse(sessionStorage.getItem('user') || '{}');
const getLabelSpan = (element) => element.querySelector('span:not(.profile-initials)');

function attachCollapses() {
    document.querySelectorAll('[data-toggle="collapse"]').forEach(btn => {
        const selector = btn.dataset.target;
        const target = selector ? document.querySelector(selector) : null;
        if (!target) {
            console.warn('[Navbar] collapse target not found:', selector);
            return;
        }
        btn.addEventListener('click', () => {
            const targetIsHidden = target.classList.contains('hidden');
            target.classList.toggle('hidden');
            btn.querySelector('svg:last-child')?.classList.toggle('rotate-180');

            const span = getLabelSpan(btn);
            if (!span) return;

            span.dataset.originalLabel ??= span.textContent;

            if (targetIsHidden) {
                span.textContent = span.dataset.originalLabel;
            } else {
                const hash = window.location.hash || '#main';
                const activeLink = target.querySelector(`a[href="${hash}"]`);
                if (activeLink) {
                    span.textContent = activeLink.textContent.trim();
                } else {
                    span.textContent = span.dataset.originalLabel;
                }
            }
        });
    });
}

async function filterByRole() {
    try {
        const role = user.roleID;

        const allowedMap = {
            'Administrador': ['system', 'planification'],
            'Recursos Humanos': ['human-resources'],
            'Registro Académico': ['academic-record'],
            'Docente': ['teacher-portal'],
            'Estudiante': ['student-portal']
        };

        const allowedDirs = allowedMap[role] || [];
        const navbar = document.querySelector('nav');

        navbar.querySelectorAll('.nav-btn').forEach(item => {
            let shouldShow = false;

            const link = item.matches('a[href]') ? item : item.querySelector('a[href]');

            if (link) {
                const href = link.getAttribute('href');
                const dir = href.split('/').slice(-2, -1)[0];

                shouldShow = ['main', 'news', 'not-found', 'profile'].includes(dir) || allowedDirs.includes(dir);
            }

            const btn = item.querySelector('button[data-toggle="collapse"]');
            if (btn) {
                const targetId = btn.dataset.target;
                const target = targetId ? document.querySelector(targetId) : null;
                if (target) {
                    shouldShow = Array.from(target.querySelectorAll('a[href]')).some(nestedLink => {
                        const dir = nestedLink.getAttribute('href').split('/').slice(-2, -1)[0];
                        return allowedDirs.includes(dir);
                    });
                }
            }

            if (shouldShow) {
                item.classList.remove('hidden');
            }
        });

    } catch (err) {
        console.error('[Navbar] role filtering failed:', err);
    }
}

async function injectProfilePicture() {
    try {
        const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
        const avatarHost = document.querySelector('#profile-avatar');
        if (!avatarHost) {
            console.warn('Profile avatar host not found');
            return;
        }
        avatarHost.innerHTML = '';
        avatarHost.appendChild(buildInitials(initials || '?'));
    } catch (err) {
        console.error('[Navbar] user fetch failed:', err);
    }
}

function highlightActive() {
    const path = window.location.pathname;

    document.querySelectorAll('#sidebar .nav-btn').forEach(entry => {
        entry.classList.remove('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'shadow-lg');
        entry.querySelectorAll('svg').forEach(s => s.classList.remove('text-white'));
        const sp = getLabelSpan(entry);
        sp?.classList.remove('text-white');
        sp?.classList.add('text-[rgb(var(--button-from))]');
        entry.querySelector('ul')?.classList.remove('bg-gradient-to-tr', 'from-[rgb(var(--body-from))]', 'to-[rgb(var(--body-to))]');
    });

    const activeLink = Array.from(document.querySelectorAll('#sidebar a[href]')).find(a => a.getAttribute('href') === path);
    if (!activeLink) return;

    const entry = activeLink.closest('.nav-btn');
    if (!entry) return;

    entry.classList.add('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'shadow-lg');
    entry.querySelectorAll('svg').forEach(s => s.classList.add('text-white'));

    const sp = getLabelSpan(entry);
    if (sp) {
        sp.classList.add('text-white');
        sp.classList.remove('text-[rgb(var(--button-from))]');

        const isCollapsed = entry.querySelector('ul')?.classList.contains('hidden');
        sp.dataset.originalLabel ??= sp.textContent;

        if (activeLink && isCollapsed) {
            sp.textContent = activeLink.textContent.trim();
        } else {
            sp.textContent = sp.dataset.originalLabel;
        }
    }

    entry.querySelector('ul')?.classList.add('bg-gradient-to-tr', 'from-[rgb(var(--body-from))]', 'to-[rgb(var(--body-to))]');
}

async function attachLogoutHandler() {
    const btn = document.querySelector('#logout-btn');
    if (!btn) {
        console.warn('Logout button not found');
        return;
    }

    btn.addEventListener('click', async () => {
        const template = document.querySelector('#logout-template');
        if(!template){
            return;
        }
        const logoutModal = template.content.querySelector('#logout-modal').cloneNode(true);
        Modal.show(logoutModal);
        const confirm = logoutModal.querySelector('#logout-confirm');
        confirm.addEventListener('click', async () => {
            await AuthService.logout();
            sessionStorage.clear();
            localStorage.clear();
            window.location.href = '/html/general/login.html';
            Modal.hide();
        });
    });
}

await filterByRole();
await injectProfilePicture();
highlightActive();
attachCollapses();
await attachLogoutHandler();