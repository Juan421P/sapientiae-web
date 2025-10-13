import { AuthService } from '../../services/auth.service';

export async function auth() {

    try {
        const session = await AuthService.me();

        if (!session || !session.user) {
            window.location.replace('/html/general/login.html');
            return;
        }

        const user = session.user;
        const role = user.roleID;

        const allowedMap = {
            'Administrador': ['system', 'planification'],
            'Recursos Humanos': ['human-resources'],
            'Registro Académico': ['academic-record'],
            'Docente': ['teacher-portal'],
            'Estudiante': ['student-portal']
        };

        const allowedDirs = allowedMap[role] || [];

        const path = window.location.pathname;
        const dir = path.split('/').slice(-2, -1)[0];

        const alwaysAllowed = ['general', 'error'];

        const isAllowed = alwaysAllowed.includes(dir) || allowedDirs.includes(dir);

        if (!isAllowed) {
            window.location.href = '/html/error/unauthorized.html';
            return;
        }

    } catch (err) {
        console.error('[Auth] Permission check failed:', err);
        window.location.href = '/html/error/unauthorized.html';
    }

}

await auth();