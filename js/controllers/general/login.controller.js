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
                emailInput.value.trim(),
                passwordInput.value.trim()
            );
           
            if (result.status === 'success') {
                await new Promise(resolve => setTimeout(resolve, 100));
               
                const user = await AuthService.me();
                sessionStorage.setItem('user', JSON.stringify(user));
               
                window.location.href = '/html/general/main.html';
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('[AuthGuard] Login failed:', error);
            alert('Error al iniciar sesión');
        }
    });
}

async function checkAuth() {
    try {
        const user = await AuthService.me();
        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
            window.location.replace('/html/general/main.html');
        }
    } catch (error) {
        console.log('[Login] No active session');
    }
}

await checkAuth();
setupPasswordField();
setupEmailField();
await setupForm();