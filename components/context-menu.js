export class ContextMenu {
    
    static menu = null;
    static isOpen = false;
    static _lastX = 0;
    static _lastY = 0;

    static _create() {
        if (this.menu) return;

        const template = document.createElement('template');
        template.innerHTML = `
            <div id="context-menu" class="absolute z-50 hidden p-2 text-sm bg-white rounded-lg shadow-md select-none"></div>
        `;
        document.body.appendChild(template.content.cloneNode(true));
        this.menu = document.getElementById('context-menu');

        this._handleOutsideClick = (e) => {
            if (!this.menu.contains(e.target)) this.close();
        };
    }

    static show(actions = []) {
        this._create();
        this.close();

        const e = window.event;
        const x = e?.clientX ?? window.innerWidth / 2;
        const y = e?.clientY ?? window.innerHeight / 2;

        this.menu.innerHTML = '';

        const icons = {
            edit: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>`,
            delete: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
            view: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M17 12h.01"/><path d="M12 12h.01"/><path d="M7 12h.01"/></svg>`
        };

        actions.forEach(action => {
            const icon = action.icon && icons[action.icon] ? icons[action.icon] : '';

            const btn = document.createElement('button');
            btn.innerHTML = `
                <div class="flex items-center gap-2">
                    ${icon}
                    <span>${action.label}</span>
                </div>
            `;
            btn.className = `
                block w-full text-left px-3 py-1.5 rounded select-none transition-all duration-150
                text-[rgb(var(--button-from))] drop-shadow-sm
                hover:bg-gradient-to-r hover:from-[rgb(var(--button-from))] hover:to-[rgb(var(--button-to))]
                hover:text-[rgb(var(--card-from))] cursor-pointer
            `;

            if (action.disabled) {
                btn.disabled = true;
                btn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                btn.addEventListener('click', () => {
                    this.close();
                    action.onClick?.();
                });
            }
            this.menu.appendChild(btn);
        });

        this.menu.classList.remove('hidden');

        this.menu.style.top = `${y}px`;
        this.menu.style.left = `${x}px`;

        const rect = this.menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) this.menu.style.left = `${window.innerWidth - rect.width}px`;
        if (rect.bottom > window.innerHeight) this.menu.style.top = `${window.innerHeight - rect.height}px`;
        if (rect.left < 0) this.menu.style.left = '0px';
        if (rect.top < 0) this.menu.style.top = '0px';

        this.isOpen = true;
        document.addEventListener('click', this._handleOutsideClick, true);
    }

    static close() {
        if (!this.menu) return;
        this.menu.classList.add('hidden');
        this.isOpen = false;
        document.removeEventListener('click', this._handleOutsideClick, true);
    }

}