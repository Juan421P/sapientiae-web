import { PensumService } from './../../services/pensa.service.js';
import { CareersService } from './../../services/careers.service.js';

const pensumList = document.querySelector('#pensum-list');
const searchInput = document.querySelector('#pensum-search');
const addPensumBtn = document.querySelector('#add-pensum-btn');

let allPensum = [];
let allCareers = [];    

function populatePensum(pensums) {
    pensumList.innerHTML = pensums.length
        ? pensums.map(p => `
            <div class="pensum-card p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col min-w-[300px] max-w-[500px]" data-id="${p.pensumID || p.PensumID}">
                <div class="mb-6">
                    <div class="flex items-start justify-between mb-3">
                        <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-lg">
                            Versión ${p.version || p.Version || 'Sin versión'}
                        </h2>
                        <span class="inline-block px-3 py-1 text-xs rounded bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] text-white font-semibold select-none drop-shadow">
                            ${p.effectiveYear || p.EffectiveYear || 'N/A'}
                        </span>
                    </div>
                    <p class="text-sm bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
                        Carrera: ${p.career || 'Sin carrera asignada'}
                    </p>
                </div>
            </div>
        `).join('')
        : `
            <div class="text-center w-full py-10">
                <span class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow text-lg">
                    No hay pensums registrados.
                </span>
            </div>
        `;

    pensumList.querySelectorAll('.pensum-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const pensum = allPensum.find(p => 
                (p.pensumID || p.PensumID) === id
            );
            
            ContextMenu.show([
                {
                    label: 'Ver detalles',
                    icon: 'view',
                    onClick: () => showViewModal(pensum)
                },
                {
                    label: 'Editar',
                    icon: 'edit',
                    onClick: () => showEditModal(pensum)
                },
                {
                    label: 'Eliminar',
                    icon: 'delete',
                    onClick: async () => {
                        const confirmed = await Toast.confirm('¿Estás seguro de eliminar este pensum?');
                        if (confirmed) {
                            try {
                                await PensumService.delete(id);
                                Toast.show('Pensum eliminado correctamente', 'success');
                                await loadPensum();
                            } catch (error) {
                                Toast.show(error.message || 'Error al eliminar el pensum', 'error');
                                console.error('Error al eliminar:', error);
                            }
                        }
                    }
                }
            ]);
        });
    });
}

async function loadPensum() {
    try {
        console.log('Cargando pensums...');
        const response = await PensumService.get();
        
        console.log('Respuesta cruda del servidor:', response);
        
        if (Array.isArray(response)) {
            allPensum = response;
        } else if (response && response.data && Array.isArray(response.data)) {
            allPensum = response.data;
        } else if (response && Array.isArray(response.content)) {
            allPensum = response.content;
        } else {
            console.error('Formato de respuesta inesperado:', response);
            allPensum = [];
        }
        
        console.log('Pensums procesados:', allPensum);
        populatePensum(allPensum);
    } catch (error) {
        console.error('Error al cargar pensums:', error);
        Toast.show('Error al cargar los pensums', 'error');
        populatePensum([]);
    }
}

async function loadCareers() {
    try {
        console.log('Cargando carreras...');
        const response = await CareersService.get();
        
        console.log('Respuesta cruda de carreras:', response);
        
        if (Array.isArray(response)) {
            allCareers = response;
        } else if (response && response.data && Array.isArray(response.data)) {
            allCareers = response.data;
        } else if (response && Array.isArray(response.content)) {
            allCareers = response.content;
        } else {
            console.error('Formato de respuesta inesperado:', response);
            allCareers = [];
        }
        
        console.log('Carreras procesadas:', allCareers);
        
        if (allCareers.length > 0) {
            console.log('Estructura de una carrera:', allCareers[0]);
            console.log('Campos disponibles:', Object.keys(allCareers[0]));
        }
    } catch (error) {
        console.error('Error al cargar carreras:', error);
        Toast.show('Error al cargar las carreras', 'error');
        allCareers = [];
    }
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        populatePensum(allPensum);
        return;
    }

    const filtered = allPensum.filter(p => {
        const version = (p.version || p.Version || '').toLowerCase();
        const year = (p.effectiveYear || p.EffectiveYear || '').toString();
        const career = (p.career || '').toLowerCase();
        
        return version.includes(searchTerm) || 
               year.includes(searchTerm) || 
               career.includes(searchTerm);
    });

    populatePensum(filtered);
});

function populateSelect(selectRoot, options = [], selectedValue = null) {
    if (!selectRoot) return;

    const menu = selectRoot.querySelector('[data-menu]');
    const text = selectRoot.querySelector('[data-text]');
    const input = selectRoot.querySelector('[data-input]');
    const chevron = selectRoot.querySelector('[data-chevron]');
    const btn = selectRoot.querySelector('[data-btn]');

    menu.innerHTML = options.map(opt => `
        <li class="px-4 py-2 cursor-pointer transition select-none 
                   bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] 
                   bg-clip-text text-transparent font-medium
                   hover:from-[rgb(var(--button-from))]/70 hover:to-[rgb(var(--button-to))]/70"
            data-value="${opt.value || opt}">
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
        text.textContent = 'Seleccione una carrera';
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

function showAddModal() {
    const template = document.querySelector('#tmpl-add-pensum');
    if (!template) return;

    const formElement = template.content.querySelector('#pensum-form').cloneNode(true);
    Modal.show(formElement);

    const selectRoot = formElement.querySelector('[data-select]');
    
    // ✅ Intentar múltiples campos para el ID de carrera
    const careerOptions = allCareers.map(c => ({
        value: c.id || c.careerID || c.CareerID || c.ID,
        label: c.nameCareer || c.name || c.Name || 'Sin nombre'
    }));
    
    console.log('🎓 Opciones de carreras para agregar:', careerOptions);
    populateSelect(selectRoot, careerOptions);

    formElement.querySelector('#cancel-btn').addEventListener('click', () => {
        Modal.hide();
    });

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(formElement);
        
        // ✅ Convertir a número ANTES de validar y asegurar que no sea NaN
        const yearValue = formData.get('EffectiveYear')?.trim();
        let yearNumber = null;
        
        if (yearValue && yearValue.length > 0) {
            yearNumber = parseInt(yearValue, 10);
            if (isNaN(yearNumber)) {
                yearNumber = null;
            }
        }
        
        const data = {
            Version: formData.get('Version')?.trim() || null,
            EffectiveYear: yearNumber,
            CareerID: formData.get('CareerID')?.trim() || null
        };

        console.log('📦 Datos capturados (POST):', data);

        // ✅ Validaciones corregidas
        if (!data.Version || data.Version.length === 0) {
            Toast.show('La versión es requerida', 'warn');
            return;
        }

        if (data.Version.length > 20) {
            Toast.show('La versión no puede exceder 20 caracteres', 'warn');
            return;
        }

        if (data.EffectiveYear === null || isNaN(data.EffectiveYear)) {
            Toast.show('El año efectivo es requerido y debe ser un número válido', 'warn');
            return;
        }

        if (data.EffectiveYear < 1900 || data.EffectiveYear > 2100) {
            Toast.show('El año debe estar entre 1900 y 2100', 'warn');
            return;
        }

        if (!data.CareerID || data.CareerID.length === 0) {
            Toast.show('Debe seleccionar una carrera', 'warn');
            return;
        }

        console.log('✅ Datos validados (POST):', data);

        try {
            const response = await PensumService.post(data);
            console.log('✅ Respuesta POST exitosa:', response);
            Toast.show('Pensum creado correctamente', 'success');
            Modal.hide();
            await loadPensum();
        } catch (error) {
            console.error('❌ Error al crear pensum:', error);
            Toast.show(error.message || 'Error al crear el pensum', 'error');
        }
    });
}

function showEditModal(pensum) {
    const template = document.querySelector('#tmpl-add-pensum');
    if (!template) return;

    const formElement = template.content.querySelector('#pensum-form').cloneNode(true);
    
    formElement.querySelector('#form-title').textContent = 'Editar pensum';
    formElement.querySelector('.text-xl').textContent = 'Modifica los campos necesarios';
    
    Modal.show(formElement);

    // ✅ Usar los campos correctos del pensum
    const version = pensum.version || pensum.Version || '';
    const year = pensum.effectiveYear || pensum.EffectiveYear || '';
    const careerId = pensum.careerID || pensum.CareerID || '';
    
    console.log('📝 Datos del pensum a editar:', { version, year, careerId });
    
    formElement.querySelector('#pensum-version').value = version;
    formElement.querySelector('#pensum-year').value = year;

    const selectRoot = formElement.querySelector('[data-select]');
    
    // ✅ Usar múltiples campos posibles
    const careerOptions = allCareers.map(c => ({
        value: c.id || c.careerID || c.CareerID || c.ID,
        label: c.nameCareer || c.name || c.Name || 'Sin nombre'
    }));
    
    console.log('🎓 Opciones de carreras para editar:', careerOptions);
    populateSelect(selectRoot, careerOptions, careerId);

    formElement.querySelector('#cancel-btn').addEventListener('click', () => {
        Modal.hide();
    });

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(formElement);
        
        // ✅ Convertir a número ANTES de validar
        const yearValue = formData.get('EffectiveYear')?.trim();
        const yearNumber = yearValue ? parseInt(yearValue, 10) : null;
        
        const data = {
            Version: formData.get('Version')?.trim(),
            EffectiveYear: yearNumber,
            CareerID: formData.get('CareerID')?.trim()
        };

        console.log('📦 Datos capturados (PUT):', data);

        // ✅ Validaciones usando los nombres CORRECTOS (PascalCase)
        if (!data.Version || data.Version.length === 0) {
            Toast.show('La versión es requerida', 'warn');
            return;
        }

        if (data.Version.length > 20) {
            Toast.show('La versión no puede exceder 20 caracteres', 'warn');
            return;
        }

        if (data.EffectiveYear === null || isNaN(data.EffectiveYear)) {
            Toast.show('El año efectivo es requerido y debe ser un número válido', 'warn');
            return;
        }

        if (data.EffectiveYear < 1900 || data.EffectiveYear > 2100) {
            Toast.show('El año debe estar entre 1900 y 2100', 'warn');
            return;
        }

        if (!data.CareerID || data.CareerID.length === 0) {
            Toast.show('Debe seleccionar una carrera', 'warn');
            return;
        }

        console.log('✅ Datos validados (PUT):', data);

        try {
            const pensumId = pensum.pensumID || pensum.PensumID;
            console.log('🆔 ID del pensum a actualizar:', pensumId);
            
            const response = await PensumService.put(pensumId, data);
            console.log('✅ Respuesta PUT exitosa:', response);
            Toast.show('Pensum actualizado correctamente', 'success');
            Modal.hide();
            await loadPensum();
        } catch (error) {
            console.error('❌ Error al actualizar pensum:', error);
            Toast.show(error.message || 'Error al actualizar el pensum', 'error');
        }
    });
}

function showViewModal(pensum) {
    const template = document.querySelector('#tmpl-view-pensum');
    if (!template) return;

    const viewElement = template.content.cloneNode(true).querySelector('div');
    
    const version = pensum.version || pensum.Version || 'Sin versión';
    const year = pensum.effectiveYear || pensum.EffectiveYear || 'N/A';
    const career = pensum.career || 'Sin carrera asignada';
    
    viewElement.querySelector('#view-title').textContent = `Versión ${version}`;
    viewElement.querySelector('#view-year').textContent = year;
    viewElement.querySelector('#view-career').textContent = career;

    Modal.show(viewElement);

    viewElement.querySelector('#close-view-btn').addEventListener('click', () => {
        Modal.hide();
    });
}

addPensumBtn.addEventListener('click', showAddModal);

await loadCareers();
await loadPensum();