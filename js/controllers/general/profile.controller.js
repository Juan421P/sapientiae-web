import { THEMES } from './../../lib/themes.js';
import { buildInitials } from './../../lib/common.js';

const user = JSON.parse(sessionStorage.getItem('user') || '{}');

function setInitialThemeMode() {
    const current = THEMES.getCurrent();
    const r = document.querySelector(`input[name="theme-mode"][value="${current.mode}"]`);
    if (r) r.checked = true;
}

function renderThemeSwatches() {
    const container = document.getElementById('themes-list');
    if (!container) return;

    container.innerHTML = '';
    const current = THEMES.getCurrent();

    const updateSelection = () => {
        container.querySelectorAll('.swatch-item').forEach(item => {
            const input = item.querySelector('input[type="radio"]');
            const visual = item.querySelector('.swatch-visual');
            const paletteName = input?.value;
            const palette = THEMES.palettes.find(p => p.name === paletteName);
            if (!palette || !visual) return;

            const outlineRgb = palette.light.textFrom;
            if (input?.checked) {
                visual.style.boxShadow = `0 0 0 4px rgba(${outlineRgb}, 0.95)`;
                visual.style.transform = 'scale(1.06)';
            } else {
                visual.style.boxShadow = 'none';
                visual.style.transform = 'scale(1)';
            }
        });
    };

    THEMES.palettes.forEach(p => {
        if (p.name === 'christmas') return;

        const label = document.createElement('label');
        label.className = 'inline-flex items-center justify-center mx-1 cursor-pointer swatch-item';
        label.setAttribute('title', p.name);

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'selected-theme';
        input.value = p.name;
        input.className = 'hidden';
        if (p.name === current.palette) input.checked = true;

        const visual = document.createElement('div');
        visual.className = 'w-10 h-10 transition-all duration-200 rounded-full swatch-visual';
        visual.style.background = `rgb(${p.light.placeholderFrom})`;
        visual.style.border = '2px solid transparent';
        visual.style.boxSizing = 'border-box';

        label.appendChild(input);
        label.appendChild(visual);
        container.appendChild(label);
    });

    updateSelection();
    container.addEventListener('change', e => {
        if (e.target?.name === 'selected-theme') updateSelection();
    });
    document.querySelectorAll('input[name="theme-mode"]').forEach(r => {
        r.addEventListener('change', () => updateSelection());
    });
}

const avatar = document.querySelector('#profile-avatar-main');
avatar?.addEventListener('click', () => {
    const img = avatar.querySelector('img');
    if (img?.src) showImageModal(img.src);
});

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
    const roleEl = document.querySelector('#profile-role');
    const emailEl = document.querySelector('#profile-email');

    if (nameEl) nameEl.textContent = `${user.firstName} ${user.lastName}`.trim();
    if (roleEl) roleEl.textContent = user.roleID || 'Usuario';
    if (emailEl) emailEl.textContent = user.email || '';

    renderAvatar();
}

function setupThemeButton() {
    document.querySelector('#theme-confirm').addEventListener('click', () => applyTheme());
}

function applyTheme() {
    const selectedPalette = document.querySelector('input[name="selected-theme"]:checked')?.value;
    const mode = document.querySelector('input[name="theme-mode"]:checked')?.value || 'light';

    if (!selectedPalette) {
        Toast.show('Por favor selecciona un tema 🫡', 'warn');
        return;
    }

    const current = THEMES.getCurrent();
    if (selectedPalette === current.palette && mode === current.mode) {
        Toast.show('Ese tema ya está seleccionado. ✨', 'warn');
        return;
    }

    const applied = THEMES.setTheme(selectedPalette, mode, true);
    Toast.show(applied ? 'Tema aplicado ✨' : 'No se pudo aplicar el tema 😕', applied ? 'info' : 'error');
}

setInitialThemeMode();
renderThemeSwatches();
setupThemeButton();
renderUserInfo();

let typed = '';

window.addEventListener('keydown', (e) => {
    if (e.key.length === 1) {
        typed += e.key.toLowerCase();
        if (typed.endsWith('navidad')) {
            activateChristmasMode();
            typed = '';
        }
        if (typed.length > 10) typed = typed.slice(-10);
    }
});

async function activateChristmasMode() {
    console.log('🎄 Navidad mode activated!');
    THEMES.setTheme('christmas', 'light', true);

    const audio = new Audio('/assets/sounds/jb.mp3');
    audio.volume = 0.7;

    audio.addEventListener('canplaythrough', () => {
        audio.play().catch(err => console.warn('Audio playback failed:', err));
    });

    audio.addEventListener('error', (err) => {
        console.error('❌ Failed to load jingle:', err);
    });

    startSnowflakes();
}

function startSnowflakes() {
    const container = document.createElement('div');
    container.id = 'snowflakes';
    container.style.position = 'fixed';
    container.style.top = 0;
    container.style.left = 0;
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = 9999;
    document.body.appendChild(container);

    for (let i = 0; i < 40; i++) {
        const flake = document.createElement('div');
        flake.textContent = '❄';
        flake.style.position = 'absolute';
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.fontSize = `${Math.random() * 1.2 + 0.8}rem`;
        flake.style.opacity = Math.random();
        flake.style.animation = `fall-${i} ${5 + Math.random() * 10}s linear infinite`;

        //flake.style.color = 'white';
        //flake.style.textShadow = '0 0 6px rgba(255,255,255,0.8)';

        flake.style.background = 'linear-gradient(to bottom, #9ca, #9cf)';
        flake.style.webkitBackgroundClip = 'text';
        flake.style.color = 'transparent';

        container.appendChild(flake);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall-${i} {
                0% { transform: translateY(-10%) rotate(0deg); }
                100% { transform: translateY(110vh) rotate(${Math.random() * 360}deg); }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => container.remove(), 30000);
}