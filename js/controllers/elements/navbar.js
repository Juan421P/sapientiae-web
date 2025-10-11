import { AuthService } from './../../services/auth.service';

const navbar = document.querySelector('#navbar');

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
        const role = ((await AuthService.me()).user).roleID;

        const allowedMap = {
            'Administrador': ['system', 'planification'],
            'Recursos Humanos': ['human-resources'],
            'Registro Académico': ['academic-record'],
            'Docente': ['teacher-portal'],
            'Estudiante': ['student-portal']
        };

        const allowedDirs = allowedMap[role] || [];

        const navbar = document.querySelector('nav');

        navbar.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');

            const dir = href.split('/').slice(-2, -1)[0];

            const isGlobal = ['main', 'news', 'not-found', 'profile'].some(file => href.includes(file));

            if (!isGlobal && !allowedDirs.includes(dir)) {
                link.closest('li')?.remove();
            }
        });

        navbar.querySelectorAll('ul').forEach(ul => {
            if (!ul.querySelector('li')) {
                ul.closest('.nav-btn')?.remove();
            }
        });

    } catch (err) {
        console.error('[Navbar] role filtering failed:', err);
    }
}

async function injectProfilePicture() {
    try {
        const user = (await AuthService.me()).user;
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
    const hash = window.location.hash || '#main';

    document.querySelectorAll('#sidebar .nav-btn').forEach(entry => {
        entry.classList.remove('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'shadow-lg');
        entry.querySelectorAll('svg').forEach(s => s.classList.remove('text-white'));
        const sp = getLabelSpan(entry);
        sp?.classList.remove('text-white');
        sp?.classList.add('text-[rgb(var(--button-from))]');
        entry.querySelector('ul')?.classList.remove('bg-gradient-to-tr', 'from-[rgb(var(--body-from))]', 'to-[rgb(var(--body-to))]');
    });

    const activeLink = document.querySelector(`#sidebar a[href="${hash}"]`);
    const entry = activeLink?.closest('.nav-btn');
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

await filterByRole();
await injectProfilePicture();
highlightActive();
attachCollapses();