import { AuthService } from '../../services/auth.service';

const form = document.querySelector('#login-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const passwordBtn = document.querySelector('#password-btn');
const eyeOpen = document.querySelector('#eye-open');
const eyeClosed = document.querySelector('#eye-closed');

function setupEmailField() {
    if (!emailInput) return;

    emailInput.addEventListener('keydown', e => {
        if ([
            'Backspace',
            'Delete',
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
            'Tab',
            'Home',
            'End',
            'Enter'
        ].includes(e.key) || e.ctrlKey || e.metaKey) return;

        if (!/^[A-Za-z0-9@.]$/.test(e.key)) {
            e.preventDefault();
        }
    });

    emailInput.addEventListener('paste', e => e.preventDefault());
}

function setupPasswordField() {
    if (!passwordInput || !passwordBtn) return;

    if (eyeOpen) eyeOpen.classList.add('hidden');
    if (eyeClosed) eyeClosed.classList.remove('hidden');

    passwordBtn.addEventListener('click', () => {
        const isHidden = passwordInput.type === 'password';
        passwordInput.type = isHidden ? 'text' : 'password';
        if (eyeOpen) eyeOpen.classList.toggle('hidden', !isHidden);
        if (eyeClosed) eyeClosed.classList.toggle('hidden', isHidden);
    });

    passwordInput.addEventListener('keydown', e => {
        if ([
            'Backspace',
            'Delete',
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
            'Tab',
            'Home',
            'End',
            'Enter'
        ].includes(e.key) || e.ctrlKey || e.metaKey) return;

        if (!/^[A-Za-z0-9#!@&]$/.test(e.key)) {
            e.preventDefault();
        }
    });

    passwordInput.addEventListener('paste', e => e.preventDefault());
}

async function setupForm() {
    form.addEventListener('submit', async e => {
        e.preventDefault();
        try {
            const result = await AuthService.login(
                (emailInput.value.trim()),
                (passwordInput.value || '').trim()
            );
            if (result.status === 'success') {
                sessionStorage.setItem('user', JSON.stringify((await AuthService.me()).user))
                window.location.href = '/html/general/main.html';
            } else {
                Toast.show('Credenciales incorrectas', 'warn');
            }
        } catch (error) {
            console.error(error);
            Toast.show('Error al iniciar sesión', 'error');
        }
    })
}

setupPasswordField();
setupEmailField();
await setupForm();