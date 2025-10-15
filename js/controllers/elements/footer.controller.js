const footer = document.querySelector('#footer');
const html = `
    <div class="flex flex-row col-span-1 gap-4 p-4 md:col-span-4 lg:col-span-3">
        <div class="flex items-center justify-center flex-shrink-0 col-span-1 p-6">
            <svg width="64" height="80" viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="text-d4 drop-shadow">
                <path
                    d="M47.1,42.4a.9.9,0,1,0-.1-1.7H45.7l1-1a.9.9,0,0,0,0-1.2.8.8,0,0,0-1.1,0l-1,1a21.9,21.9,0,0,0-3.5-5.8l-.6-6.1a2.2,2.2,0,0,0-2.6-2l-6.1,1a17.1,17.1,0,0,0-4.4-1.3c.3-.2.5-.4.4-.7s-2-.2-2-.2c1.5-1.3,1.1-1.9,1.1-1.9s-2.8,1.2-2.8,1.2-.4-1.6-.4-1.6-2,2.2-2.2,3A20.8,20.8,0,0,0,13.7,28L7.6,27A2.2,2.2,0,0,0,5,29l-.9,9.2h0a16,16,0,0,0-1.8,6.7c0,.5.1,1,.1,1.4H.8a.9.9,0,0,0-.8.9.9.9,0,0,0,.8.8H2.6l-1.5.7a.7.7,0,0,0-.4,1,.8.8,0,0,0,1,.5l1.2-.6-.6,1.3A.9.9,0,0,0,2.7,52a.8.8,0,0,0,1.1-.4l.3-.7C7.5,56.3,15.1,60,24,60c12,0,21.7-6.8,21.7-15.1v-.6l.8.3a.7.7,0,0,0,1-.5.7.7,0,0,0-.4-1l-1.7-.6h1.7ZM28.4,44.1h-.6a2.7,2.7,0,0,1-1.4-.4,1.8,1.8,0,0,1-.5-.7l-.4.6a2.6,2.6,0,0,1-2.1.8h0a.3.3,0,0,1-.3-.3c0-.1.1-.2.3-.2a1.8,1.8,0,0,0,1.7-.7,1.4,1.4,0,0,0,.4-1v-.2h0c-1.6.1-2.9-.3-3-1s1.2-1.2,2.8-1.4,2.8.3,2.9,1S27.3,41.8,26,42v.3a3,3,0,0,0,.7,1.1,2.5,2.5,0,0,0,1.6.2l.3.2C28.6,43.9,28.6,44.1,28.4,44.1Z"
                    transform="translate(0 0)" style="fill:#2b2b2b" />
                <path
                    d="M40.3,18.4a5.3,5.3,0,0,1-2.2.4s6.3-3.6,2.2-6.4a1.2,1.2,0,0,0-1.8.8s-1.3,3.6-4.6,4.4a9.1,9.1,0,0,0,.1-3.3,10.1,10.1,0,0,0-4.1-6.5C20.6-4.7,4.7,1.6,4.7,1.6L12,10.9A9.5,9.5,0,0,0,10.3,18c.9,5.8,6.9,9.6,13.5,8.6A12.9,12.9,0,0,0,32,21.8c.4,1.6,1.6,5.3,3.9,3.5,0,0,2.4-1.5-1-3.7,0,0,6.5,3.1,6.7-2.6A.8.8,0,0,0,40.3,18.4ZM21,4.5c.4,0,.7.7.7,1.5s-.3,1.4-.7,1.4-.7-.6-.7-1.4S20.6,4.5,21,4.5ZM32.9,16.2c-1.6,3.8-6.1,3.7-6.1,3.7h-.1c-8,0-8.5-7.8-8.5-7.9l.2-.2c.2-.1.3.1.3.2s.5,7.4,8,7.4h.1c.2,0,4.1,0,5.6-3.2L25.7,9.5a.2.2,0,0,1,0-.3h.4L32.9,16Z"
                    transform="translate(0 0)" style="fill:#2b2b2b" />
            </svg>
        </div>
        <div class="flex flex-col justify-center col-span-3 gap-1">
            <p class="text-sm font-bold text-white select-none text-shadow">Sistema de Registro</p>
            <p class="text-sm font-bold text-white select-none text-shadow">Académico Universitario</p>
            <p class="text-xl italic font-bold text-white select-none text-shadow">Sapientiae</p>
        </div>
    </div>
    <div class="hidden col-span-1 md:block md:col-span-4 lg:col-span-6"></div>
    <div
        class="flex items-center justify-center col-span-1 pb-10 pl-10 pr-10 md:col-span-4 lg:col-span-3 md:pb-0 md:pl-0 md:pr-15 md:mt-0">
        <div>
            <p class="font-bold text-white select-none text-shadow">
                &copy; 2025 B. Alvarenga, D. Gómez, I. Nolazco, J. Pérez, J. Portillo. Todos los derechos reservados.
                <!-- &copy; 2025 La Morenita, Tortillería & Meat Market. Todos los derechos reservados. -->
            </p>
        </div>
    </div>
`;

function loadFooter() {
    document.querySelector('#footer').innerHTML = html;
}

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

loadFooter();
attachListeners();