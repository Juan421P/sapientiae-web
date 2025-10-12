export class ContextMenu {

    static menu = null;
    static isOpen = false;
    static _lastX = 0;
    static _lastY = 0;

    static _create() {
        if (this.menu) return;

        const template = document.createElement('template');
        template.innerHTML = `
            <div id="context-menu" class="absolute z-50 hidden p-2 text-sm bg-white rounded-lg shadow-md select-none">
            </div>
        `;
        document.body.appendChild(template.content.cloneNode(true));

        this.menu = document.getElementById('context-menu');

        document.addEventListener('mousemove', (e) => {
            this._lastX = e.clientX;
            this._lastY = e.clientY;
        });

        this._handleOutsideClick = (e) => {
            if (!this.menu.contains(e.target)) {
                this.close();
            }
        };
    }

    static show(actions = [], pos = 'br') {
        this._create();
        this.close();

        const x = this._lastX ?? window.innerWidth / 2;
        const y = this._lastY ?? window.innerHeight / 2;

        this.menu.innerHTML = '';

        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.textContent = action.label;
            btn.className = `block cursor-pointer w-full text-left px-3 py-1 rounded transition-colors hover:bg-[rgb(var(--card-from))] hover:text-[rgb(var(--text-from))] ${action.className || ''}`;
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

        this.menu.style.top = '';
        this.menu.style.left = '';
        this.menu.style.bottom = '';
        this.menu.style.right = '';

        switch (pos) {
            case 'br':
                this.menu.style.top = `${y}px`;
                this.menu.style.left = `${x}px`;
                break;
            case 'tr':
                this.menu.style.bottom = `${window.innerHeight - y}px`;
                this.menu.style.left = `${x}px`;
                break;
            case 'bl':
                this.menu.style.top = `${y}px`;
                this.menu.style.right = `${window.innerWidth - x}px`;
                break;
            case 'tl':
                this.menu.style.bottom = `${window.innerHeight - y}px`;
                this.menu.style.right = `${window.innerWidth - x}px`;
                break;
        }

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
