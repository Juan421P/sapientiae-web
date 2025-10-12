import { AuthService } from '../../services/auth.service';

export async function auth() {
    try {
        const session = await AuthService.me();
        if (!session || !session.user) {
            window.location.href = '/html/general/login.html';
            return;
        }

        const role = session.user.roleID;
        const currentPath = window.location.pathname;

        if (currentPath.includes('/system/') && role !== 'Administrador') {
            window.location.href = '/unauthorized.html';
        }

        if (currentPath.includes('/planification/') && !['Administrador', 'Registro Académico'].includes(role)) {
            window.location.href = '/unauthorized.html';
        }

        console.log(`[AuthGuard] Access granted for ${role} on ${currentPath}`);
    } catch (error) {
        console.error('[AuthGuard] Failed:', error);
        window.location.href = '';
    }
}