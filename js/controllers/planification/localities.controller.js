import { LocalitiesService } from './../../services/localities.service';
import { UniversityService } from './../../services/universities.service';

const localityList = document.querySelector('#locality-list');
const searchInput = document.querySelector('#locality-search');
const addLocalityBtn = document.querySelector('#add-locality-btn');

let allLocalities = [];
let allUniversities = [];

function populateLocalities(localities) {
    localityList.innerHTML = localities.length ? localities.map(loc => `
        <div class="locality-card p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col min-w-[300px] max-w-[500px]" data-id="${loc.localityID}">
            <div class="mb-6">
                <div class="flex items-start justify-between mb-3">
                    <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-lg">
                        ${loc.universityName || 'Sin universidad'}
                    </h2>
                    ${loc.isMainLocality ? `
                        <span class="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold shadow select-none">
                            PRINCIPAL
                        </span>
                    ` : ''}
                </div>
                
                <div class="space-y-2">
                    <div class="flex items-start gap-2">
                        <svg class="w-4 h-4 mt-1 text-[rgb(var(--placeholder-from))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
                            ${loc.address || 'Sin dirección'}
                        </span>
                    </div>
                    
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[rgb(var(--placeholder-from))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent font-medium">
                            ${loc.phoneNumber || 'Sin teléfono'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `).join('') : `
        <div class="text-center w-full py-10">
            <span class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow">
                No hay localidades registradas.
            </span>
        </div>
    `;

    localityList.querySelectorAll('.locality-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const locality = allLocalities.find(l => l.localityID === id);
            ContextMenu.show([
                {
                    label: 'Editar',
                    icon: 'edit',
                    onClick: () => showEditModal(locality)
                },
                {
                    label: 'Eliminar',
                    icon: 'delete',
                    onClick: async () => {
                        const confirmed = await Toast.confirm('¿Estás seguro de eliminar esta localidad?');
                        if (confirmed) {
                            try {
                                await LocalitiesService.delete(id);
                                Toast.show('Localidad eliminada correctamente', 'success');
                                await loadLocalities();
                            } catch (error) {
                                Toast.show('Error al eliminar la localidad', 'error');
                                console.error(error);
                            }
                        }
                    }
                }
            ]);
        });
    });
}

async function loadLocalities() {
    try {
        console.log('🔵 Cargando localidades...');
        const response = await LocalitiesService.get();
        console.log('🔵 Respuesta recibida:', response);
        
        if (Array.isArray(response)) {
            allLocalities = response;
        } else if (response && response.data && Array.isArray(response.data)) {
            allLocalities = response.data;
        } else {
            console.warn('⚠️ Formato inesperado:', response);
            allLocalities = [];
        }
        
        console.log('🔵 Localidades procesadas:', allLocalities.length);
        populateLocalities(allLocalities);
    } catch (error) {
        console.error('🔴 ERROR CARGANDO LOCALIDADES:', error);
        Toast.show('Error al cargar las localidades', 'error');
        populateLocalities([]);
    }
}

async function loadUniversities() {
    try {
        console.log('🟢 Cargando universidades...');
        const response = await UniversityService.get();
        console.log('🟢 Universidades recibidas:', response);
        
        if (Array.isArray(response)) {
            allUniversities = response;
        } else if (response && response.data && Array.isArray(response.data)) {
            allUniversities = response.data;
        } else {
            allUniversities = [];
        }
        
        console.log('🟢 Total universidades:', allUniversities.length);
        console.log('🟢 Universidades:', allUniversities);
        
        if (allUniversities.length === 0) {
            console.error('🔴 NO HAY UNIVERSIDADES DISPONIBLES');
        }
    } catch (error) {
        console.error('🔴 ERROR CARGANDO UNIVERSIDADES:', error);
        Toast.show('Error al cargar las universidades', 'error');
        allUniversities = [];
    }
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    if (!searchTerm) {
        populateLocalities(allLocalities);
        return;
    }

    const filtered = allLocalities.filter(l =>
        (l.universityName || '').toLowerCase().includes(searchTerm) ||
        (l.address || '').toLowerCase().includes(searchTerm) ||
        (l.phoneNumber || '').includes(searchTerm)
    );
    populateLocalities(filtered);
});

function populateSelect(selectRoot, options = [], selectedValue = null) {
    if (!selectRoot) return;

    const menu = selectRoot.querySelector('[data-menu]');
    const text = selectRoot.querySelector('[data-text]');
    const input = selectRoot.querySelector('[data-input]');
    const chevron = selectRoot.querySelector('[data-chevron]');
    const btn = selectRoot.querySelector('[data-btn]');

    menu.innerHTML = options.map(opt => `
        <li class="px-4 py-2 cursor-pointer transition select-none bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent font-medium hover:from-[rgb(var(--button-from))]/70 hover:to-[rgb(var(--button-to))]/70" data-value="${opt.value || opt}">
            ${opt.label || opt}
        </li>
    `).join('');

    btn.addEventListener('click', () => {
        const isOpen = !menu.classList.contains('hidden');
        menu.classList.toggle('hidden', isOpen);
        chevron.classList.toggle('rotate-180', !isOpen);
    });

    document.addEventListener('click', e => {
        if (!selectRoot.contains(e.target)) {
            menu.classList.add('hidden');
            chevron.classList.remove('rotate-180');
        }
    });

    menu.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            const val = li.dataset.value;
            const label = li.textContent.trim();
            text.textContent = label;
            text.classList.remove('italic', 'text-[rgb(var(--placeholder-from))]');
            text.classList.add('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'bg-clip-text', 'text-transparent');
            input.value = val;
            menu.classList.add('hidden');
            chevron.classList.remove('rotate-180');
        });
    });

    btn.addEventListener('contextmenu', e => {
        e.preventDefault();
        text.textContent = 'Seleccione una universidad';
        text.classList.add('italic', 'text-[rgb(var(--placeholder-from))]');
        text.classList.remove('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'bg-clip-text', 'text-transparent');
        input.value = '';
    });

    if (selectedValue !== null) {
        const found = options.find(opt => (opt.value || opt) === selectedValue);
        if (found) {
            text.textContent = found.label || found;
            text.classList.remove('italic', 'text-[rgb(var(--placeholder-from))]');
            text.classList.add('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'bg-clip-text', 'text-transparent');
            input.value = selectedValue;
        }
    }
}

function applyPhoneMask(input) {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) {
            value = value.slice(0, 4) + '-' + value.slice(4, 8);
        }
        e.target.value = value;
    });
}

function showAddModal() {
    console.log('🟡 Abriendo modal para agregar');
    console.log('🟡 Universidades disponibles:', allUniversities.length);
    
    if (allUniversities.length === 0) {
        console.error('🔴 NO HAY UNIVERSIDADES - BLOQUEANDO');
        Toast.show('No hay universidades registradas. Registra una primero.', 'warn');
        return;
    }
    
    const template = document.querySelector('#tmpl-add-locality');
    if (!template) {
        console.error('🔴 Template no encontrado');
        return;
    }

    const formElement = template.content.querySelector('#locality-form').cloneNode(true);
    Modal.show(formElement);

    const selectRoot = formElement.querySelector('[data-select]');
    const universityOptions = allUniversities.map(u => ({
        value: u.universityID,
        label: u.universityName
    }));
    
    console.log('🟡 Opciones de universidad:', universityOptions);
    populateSelect(selectRoot, universityOptions);

    const phoneInput = formElement.querySelector('#locality-phone');
    applyPhoneMask(phoneInput);

    formElement.querySelector('#cancel-btn').addEventListener('click', () => {
        Modal.hide();
    });

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📤 INICIANDO ENVÍO DE FORMULARIO');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const formData = new FormData(formElement);
        const isMainLocalityCheckbox = formElement.querySelector('#is-main-locality');
        
        // LOG CADA CAMPO INDIVIDUALMENTE
        console.log('📋 FormData valores:');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}: "${value}" (tipo: ${typeof value})`);
        }
        
        const data = {
            universityID: formData.get('universityID') || '',
            address: (formData.get('address') || '').trim(),
            phoneNumber: formData.get('phoneNumber') || '',
            isMainLocality: isMainLocalityCheckbox ? isMainLocalityCheckbox.checked : false
        };

        console.log('📦 Objeto data ANTES de enviar:');
        console.log('  universityID:', `"${data.universityID}"`, '(tipo:', typeof data.universityID, ')');
        console.log('  address:', `"${data.address}"`, '(tipo:', typeof data.address, ')');
        console.log('  phoneNumber:', `"${data.phoneNumber}"`, '(tipo:', typeof data.phoneNumber, ')');
        console.log('  isMainLocality:', data.isMainLocality, '(tipo:', typeof data.isMainLocality, ')');
        console.log('📦 JSON.stringify:', JSON.stringify(data, null, 2));
        
        // Validaciones
        if (!data.universityID) {
            console.error('❌ Validación fallida: universityID vacío');
            Toast.show('Debe seleccionar una universidad', 'warn');
            return;
        }

        if (!data.address) {
            console.error('❌ Validación fallida: address vacío');
            Toast.show('La dirección es requerida', 'warn');
            return;
        }

        if (!data.phoneNumber) {
            console.error('❌ Validación fallida: phoneNumber vacío');
            Toast.show('El teléfono es requerido', 'warn');
            return;
        }

        if (!/^\d{4}-\d{4}$/.test(data.phoneNumber)) {
            console.error('❌ Validación fallida: formato teléfono incorrecto');
            Toast.show('El teléfono debe tener el formato 1234-5678', 'warn');
            return;
        }

        console.log('✅ Todas las validaciones pasadas');
        console.log('🚀 ENVIANDO A LocalitiesService.post()...');

        try {
            const response = await LocalitiesService.post(data);
            console.log('✅ RESPUESTA EXITOSA:', response);
            Toast.show('Localidad creada correctamente', 'success');
            Modal.hide();
            await loadLocalities();
        } catch (error) {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('❌ ERROR CAPTURADO');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('Error completo:', error);
            console.error('error.status:', error.status);
            console.error('error.message:', error.message);
            console.error('error.details:', error.details);
            console.error('error.response:', error.response);
            
            let errorMessage = 'Error desconocido';
            
            if (error.details && error.details.length > 0) {
                errorMessage = error.details.join(', ');
                console.log('📝 Usando error.details:', errorMessage);
            } else if (error.message) {
                errorMessage = error.message;
                console.log('📝 Usando error.message:', errorMessage);
            }
            
            console.log('📢 Mostrando Toast:', errorMessage);
            Toast.show(errorMessage, 'error');
        }
    });
}

function showEditModal(locality) {
    const template = document.querySelector('#tmpl-add-locality');
    if (!template) return;

    const formElement = template.content.querySelector('#locality-form').cloneNode(true);
    formElement.querySelector('.text-3xl').textContent = 'Editar localidad';
    formElement.querySelector('.text-xl').textContent = 'Modifica los campos necesarios';
    Modal.show(formElement);

    formElement.querySelector('#locality-address').value = locality.address || '';
    formElement.querySelector('#locality-phone').value = locality.phoneNumber || '';
    
    const isMainCheckbox = formElement.querySelector('#is-main-locality');
    if (isMainCheckbox) {
        isMainCheckbox.checked = locality.isMainLocality === true;
    }

    const selectRoot = formElement.querySelector('[data-select]');
    const universityOptions = allUniversities.map(u => ({
        value: u.universityID,
        label: u.universityName
    }));
    populateSelect(selectRoot, universityOptions, locality.universityID);

    const phoneInput = formElement.querySelector('#locality-phone');
    applyPhoneMask(phoneInput);

    formElement.querySelector('#cancel-btn').addEventListener('click', () => {
        Modal.hide();
    });

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(formElement);
        const isMainLocalityCheckbox = formElement.querySelector('#is-main-locality');
        
        const data = {
            universityID: formData.get('universityID') || '',
            address: (formData.get('address') || '').trim(),
            phoneNumber: formData.get('phoneNumber') || '',
            isMainLocality: isMainLocalityCheckbox ? isMainLocalityCheckbox.checked : false
        };

        console.log('Datos actualización:', data);

        if (!data.universityID) {
            Toast.show('Debe seleccionar una universidad', 'warn');
            return;
        }

        if (!data.address) {
            Toast.show('La dirección es requerida', 'warn');
            return;
        }

        if (!data.phoneNumber) {
            Toast.show('El teléfono es requerido', 'warn');
            return;
        }

        if (!/^\d{4}-\d{4}$/.test(data.phoneNumber)) {
            Toast.show('El teléfono debe tener el formato 1234-5678', 'warn');
            return;
        }

        try {
            const response = await LocalitiesService.put(locality.localityID, data);
            console.log('Respuesta PUT:', response);
            Toast.show('Localidad actualizada correctamente', 'success');
            Modal.hide();
            await loadLocalities();
        } catch (error) {
            console.error('Error actualización:', error);
            
            let errorMessage = 'Error al actualizar';
            if (error.details && error.details.length > 0) {
                errorMessage = error.details.join(', ');
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Toast.show(errorMessage, 'error');
        }
    });
}

addLocalityBtn.addEventListener('click', showAddModal);

console.log('🔵 Iniciando carga de datos...');
await loadUniversities();
await loadLocalities();
console.log('✅ Carga inicial completada');