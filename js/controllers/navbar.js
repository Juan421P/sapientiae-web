import { AuthService } from './../services/auth.service';

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
            'Administrador': ['#system-', '#planification-'],
            'Recursos Humanos': ['#hr-'],
            'Registro Académico': ['#ar-'],
            'Docente': ['#tp-'],
            'Estudiante': ['#sp-']
        };

        const allowedPrefixes = allowedMap[role] || [];

        navbar.querySelectorAll('a[href]').forEach(link => {
            const hash = link.getAttribute('href');
            const isGlobal = ['#main', '#notifications', '#not-found', '#profile'].includes(hash);
            if (!isGlobal && !allowedPrefixes.some(pref => hash.startsWith(pref))) {
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

filterByRole();