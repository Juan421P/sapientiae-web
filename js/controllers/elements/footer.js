const footer = document.querySelector('#footer');

function attachListeners() {
    window.addEventListener('scroll', onScroll);
    onScroll();
    footer.addEventListener('click', () => {
        footer.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
        footer.classList.add('opacity-0', 'pointer-events-none', 'translate-y-full');
    });
}

function onScroll() {
    const scrollY = window.scrollY;
    const visibleHeight = window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    const atBottom = pageHeight - (scrollY + visibleHeight) <= 1;
    if (atBottom) {
        footer.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-full');
        footer.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
    } else {
        footer.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
        footer.classList.add('opacity-0', 'pointer-events-none', 'translate-y-full');
    }
}

attachListeners();