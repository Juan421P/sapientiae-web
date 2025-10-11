export class Modal {

    static overlay = null;
    static borderWrapper = null;
    static container = null;
    static activeElement = null;
    static originalParent = null;
    static isVisible = false;

    static _createStructure() {
        this.overlay = document.createElement('div');
        this.overlay.className =
            'fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300 z-[9999]';

        this.borderWrapper = document.createElement('div');
        this.borderWrapper.className =
            'rounded-2xl p-1 bg-gradient-to-r from-[rgb(var(--placeholder-from))] to-[rgb(var(--placeholder-to))] flex items-center justify-center drop-shadow';

        this.container = document.createElement('div');
        this.container.className =
            'relative rounded-xl bg-gradient-to-br from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] transition-all duration-300 scale-90 opacity-0 flex items-center justify-center shadow-xl';

        this.borderWrapper.appendChild(this.container);
        this.overlay.appendChild(this.borderWrapper);
        document.body.appendChild(this.overlay);

        this.overlay.addEventListener('click', e => {
            if (e.target === this.overlay) this.hide();
        });

        this.isVisible = false;
    }

    static show(element) {
        if (!(element instanceof HTMLElement)) {
            console.error('Modal.show() expects an HTMLElement.');
            return;
        }

        if (!this.overlay) this._createStructure();

        this.originalParent = element.parentElement;
        this.activeElement = element;

        this.container.style.padding = '0';

        if (element.tagName.toLowerCase() === 'img') {
            element.style.maxWidth = '70vw';
            element.style.maxHeight = '60vh';
            element.style.objectFit = 'contain';
            element.style.borderRadius = '1rem';
            element.classList.add('select-none');

            this.container.style.padding = '2rem';
        }

        this.container.appendChild(element);

        requestAnimationFrame(() => {
            this.overlay.classList.remove('opacity-0', 'pointer-events-none');
            this.overlay.classList.add('opacity-100');
            this.container.classList.remove('scale-90', 'opacity-0');
            this.container.classList.add('scale-100', 'opacity-100');
        });

        this.isVisible = true;
    }

    static showImage(src, alt = '') {
        if (!src) {
            console.warn('[Modal.showImage] No image source provided');
            return;
        }

        const img = document.createElement('img');
        img.src = src instanceof Blob || src instanceof File ? URL.createObjectURL(src) : src;
        img.alt = alt || 'Preview image';
        img.classList = 'drop-shadow-2xl';

        Modal.show(img);

        if (src instanceof Blob || src instanceof File) {
            img.addEventListener('load', () => URL.revokeObjectURL(img.src));
        }
    }

    static hide() {
        if (!this.isVisible || !this.overlay || !this.activeElement) return;

        this.overlay.classList.remove('opacity-100');
        this.overlay.classList.add('opacity-0', 'pointer-events-none');
        this.container.classList.remove('scale-100', 'opacity-100');
        this.container.classList.add('scale-90', 'opacity-0');

        const elementToRestore = this.activeElement;
        const parentToRestore = this.originalParent;

        const cleanup = () => {
            if (parentToRestore && elementToRestore) {
                parentToRestore.appendChild(elementToRestore);
            }
            this.overlay.remove();
            this.overlay = this.container = this.borderWrapper = this.activeElement = this.originalParent = null;
            this.isVisible = false;
        };

        const hasTransition = getComputedStyle(this.overlay).transitionDuration !== '0s';
        if (hasTransition) {
            this.overlay.addEventListener('transitionend', cleanup, { once: true });
        } else {
            cleanup();
        }
    }

}