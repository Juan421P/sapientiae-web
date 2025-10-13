export class Toast {
    
    static containerId = 'toast-container';

    static _ensureContainer() {
        let container = document.getElementById(this.containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = this.containerId;
            container.className = 'fixed top-5 right-5 flex flex-col gap-2 max-w-sm z-[9999]';
            document.body.appendChild(container);
        }
        return container;
    }

    static show(message, type = 'info', duration = 7000) {
        const container = this._ensureContainer();

        const typeColors = {
            info: 'from-indigo-400 to-blue-400',
            success: 'from-green-500 to-emerald-500',
            warn: 'from-amber-400 to-yellow-400',
            error: 'from-rose-400 to-red-400'
        };

        const icons = {
            info: `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 shrink-0 stroke-white drop-shadow" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>`,
            success: `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 shrink-0 stroke-white drop-shadow" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
            </svg>`,
            warn: `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 shrink-0 stroke-white drop-shadow" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" x2="12" y1="8" y2="12"/>
                <line x1="12" x2="12.01" y1="16" y2="16"/>
            </svg>`,
            error: `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 shrink-0 stroke-white drop-shadow" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 9 9 15"/><path d="M9 9l6 6"/>
            </svg>`
        };

        const toast = document.createElement('div');
        toast.className = `relative flex items-center gap-3 pointer-events-auto px-5 py-4 rounded shadow-lg text-md overflow-hidden max-w-sm min-w-[220px] text-white bg-gradient-to-r ${typeColors[type]} animate-toast-fade`;
        toast.style.animationDuration = `${duration}ms`;
        toast.style.userSelect = 'none';

        toast.innerHTML = `
        <div class="flex items-center gap-3 flex-1 pr-1.5">
            ${icons[type] || icons.info}
            <span class="drop-shadow-2xl select-none pl-2">${message}</span>
        </div>
        `;

        const progressBar = document.createElement('div');
        progressBar.className = 'absolute bottom-0 left-0 h-1 bg-white/30 progress-bar';
        progressBar.style.width = '100%';
        progressBar.style.transition = 'none';
        toast.appendChild(progressBar);

        container.appendChild(toast);

        requestAnimationFrame(() => {
            progressBar.offsetWidth;
            progressBar.style.transition = `width ${duration - 100}ms linear`;
            progressBar.style.width = '0%';
        });

        toast.addEventListener('animationend', e => {
            if (e.animationName === 'toast-fade') toast.remove();
        });
    }
    
}