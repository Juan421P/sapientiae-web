import { LocalitiesService } from './../../services/localities.service.js';
import { UniversityService } from './../../services/universities.service.js';

const localityList = document.querySelector('#locality-list');
const addLocalityBtn = document.querySelector('#add-locality');
const searchInput = document.querySelector('#locality-search');
const prevPageBtn = document.querySelector('#prev-page');
const nextPageBtn = document.querySelector('#next-page');
const pageInfo = document.querySelector('#page-info');

let currentPage = 0;
let totalPages = 0;
let allLocalities = [];
let filteredLocalities = [];
const pageSize = 10;

function applyPhoneMask(input) {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 4) {
            value = value.slice(0, 4) + '-' + value.slice(4, 8);
        }
        
        e.target.value = value;
    });
}

async function loadUniversities() {
    try {
        const universities = await UniversityService.get();
        return universities;
    } catch (error) {
        Toast.show('Error al cargar universidades', 'error');
        return [];
    }
}

function populateLocalities(localities) {
    localityList.innerHTML = localities.length
        ? localities.map(loc => `
            <div class="locality-card p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col min-w-[320px] max-w-[450px]" data-id="${loc.localityID}">
                <div class="mb-6">
                    <div class="flex items-start justify-between mb-3">
                        <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-lg">
                            ${loc.universityName || 'Sin universidad'}
                        </h2>
                        ${loc.isMainLocality ? `
                            <span class="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold shadow">
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
        `).join('')
        : `
            <div class="text-center w-full py-10">
                <span class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow text-lg">
                    No hay localidades registradas.
                </span>
            </div>
        `;

    attachCardEvents();
}

function attachCardEvents() {
    localityList.querySelectorAll('.locality-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const locality = allLocalities.find(loc => loc.localityID === id);
            
            ContextMenu.show([
                {
                    label: 'Editar',
                    icon: 'edit',
                    onClick: () => showEditForm(locality)
                },
                {
                    label: 'Eliminar',
                    icon: 'delete',
                    onClick: async () => {
                        const confirmed = await Toast.confirm('¿Está seguro de eliminar esta localidad?');
                        if (confirmed) {
                            try {
                                await LocalitiesService.delete(id);
                                Toast.show('Localidad eliminada', 'success');
                                await loadLocalities();
                            } catch (error) {
                                Toast.show(error.message || 'Error al eliminar', 'error');
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
        let response;
        
        console.log('Intentando cargar localidades...');
        
        // Intentar primero con el endpoint simple (más confiable)
        try {
            console.log('Llamando a /getDataLocality...');
            response = await LocalitiesService.get();
            console.log('Respuesta recibida:', response);
            
            // Manejar diferentes formatos de respuesta
            if (Array.isArray(response)) {
                allLocalities = response;
            } else if (response && Array.isArray(response.data)) {
                allLocalities = response.data;
            } else if (response && Array.isArray(response.content)) {
                allLocalities = response.content;
            } else {
                console.warn('Formato de respuesta inesperado, asumiendo array vacío');
                allLocalities = [];
            }
            
            totalPages = Math.ceil(allLocalities.length / pageSize) || 1;
            
        } catch (simpleError) {
            console.error('Error en endpoint simple:', simpleError);
            
            // Intentar con endpoint paginado como último recurso
            try {
                console.log('📡 Intentando endpoint paginado como fallback...');
                response = await LocalitiesService.getPaginated(currentPage, pageSize);
                console.log('Respuesta paginada:', response);
                
                if (response && response.content) {
                    allLocalities = response.content;
                    totalPages = response.totalPages || 1;
                } else {
                    throw new Error('Formato de respuesta paginada inválido');
                }
            } catch (paginatedError) {
                console.error('Error en endpoint paginado también:', paginatedError);
                throw simpleError; // Lanzar el error original
            }
        }
        
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        filteredLocalities = allLocalities.slice(startIndex, endIndex);
        
        console.log(`Cargadas ${allLocalities.length} localidades (mostrando ${filteredLocalities.length})`);
        
        populateLocalities(filteredLocalities);
        updatePaginationControls();
        
    } catch (error) {
        console.error('ERROR FATAL al cargar localidades');
        console.error('Detalles completos del error:', {
            name: error.name,
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers,
            url: error.config?.url,
            method: error.config?.method
        });
        
        if (error.stack) {
            console.error('📚 Stack trace:', error.stack);
        }
        
        let errorMsg = 'Error al cargar localidades del servidor';
        let errorDetails = '';
        
        if (error.response?.status === 500) {
            errorMsg = 'Error interno del servidor (500)';
            errorDetails = 'Posibles causas:\n' +
                          '• La tabla LOCALITIES está vacía\n' +
                          '• Hay datos corruptos en la base de datos\n' +
                          '• Problema con las relaciones de Universidad\n' +
                          '• Revisa los logs del servidor Spring Boot';
        } else if (error.response?.status === 404) {
            errorMsg = 'Endpoint no encontrado (404)';
            errorDetails = 'Verifica que el servidor esté corriendo en el puerto correcto';
        } else if (error.code === 'ERR_NETWORK') {
            errorMsg = 'No se pudo conectar al servidor';
            errorDetails = 'Verifica que el backend esté corriendo';
        } else if (error.response?.data?.message) {
            errorMsg = error.response.data.message;
        }
        
        console.error('🔴 ' + errorMsg);
        if (errorDetails) {
            console.error('ℹ️ ' + errorDetails);
        }
        
        Toast.show(errorMsg, 'error');
        
        allLocalities = [];
        filteredLocalities = [];
        totalPages = 1;
        currentPage = 0;
        populateLocalities([]);
        updatePaginationControls();
        
        console.log('⚠️ Aplicación en modo degradado - puedes intentar agregar localidades');
    }
}

function updatePaginationControls() {
    pageInfo.textContent = `Página ${currentPage + 1} de ${totalPages}`;
    prevPageBtn.disabled = currentPage === 0;
    nextPageBtn.disabled = currentPage >= totalPages - 1;
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        filteredLocalities = allLocalities.slice(startIndex, endIndex);
    } else {
        const filtered = allLocalities.filter(loc => 
            loc.universityName?.toLowerCase().includes(searchTerm) ||
            loc.address?.toLowerCase().includes(searchTerm) ||
            loc.phoneNumber?.includes(searchTerm)
        );
        filteredLocalities = filtered;
    }
    
    populateLocalities(filteredLocalities);
});

prevPageBtn.addEventListener('click', async () => {
    if (currentPage > 0) {
        currentPage--;
        searchInput.value = '';
        await loadLocalities();
    }
});

nextPageBtn.addEventListener('click', async () => {
    if (currentPage < totalPages - 1) {
        currentPage++;
        searchInput.value = ''; 
        await loadLocalities();
    }
});

addLocalityBtn.addEventListener('click', () => showAddForm());

async function showAddForm() {
    const template = document.querySelector('#tmpl-add-locality');
    const form = template.content.cloneNode(true);
    
    const universities = await loadUniversities();
    const select = form.querySelector('#university-select');
    
    universities.forEach(uni => {
        const option = document.createElement('option');
        option.value = uni.universityID;
        option.textContent = uni.universityName;
        select.appendChild(option);
    });
    
    const phoneInput = form.querySelector('#locality-phone');
    applyPhoneMask(phoneInput);
    
    const formElement = form.querySelector('#locality-form');
    formElement.addEventListener('submit', handleAddSubmit);
    
    form.querySelector('#cancel-btn').addEventListener('click', () => Modal.hide());
    
    Modal.show(formElement);
}

async function showEditForm(locality) {
    const template = document.querySelector('#tmpl-add-locality');
    const form = template.content.cloneNode(true);
    
    form.querySelector('#form-title').textContent = 'Editar localidad';
    
    const universities = await loadUniversities();
    const select = form.querySelector('#university-select');
    
    universities.forEach(uni => {
        const option = document.createElement('option');
        option.value = uni.universityID;
        option.textContent = uni.universityName;
        if (uni.universityID === locality.universityID) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    form.querySelector('#locality-address').value = locality.address;
    form.querySelector('#locality-phone').value = locality.phoneNumber;
    form.querySelector('#is-main-locality').checked = locality.isMainLocality;
    
    const phoneInput = form.querySelector('#locality-phone');
    applyPhoneMask(phoneInput);
    
    const formElement = form.querySelector('#locality-form');
    formElement.dataset.editId = locality.localityID;
    formElement.addEventListener('submit', handleEditSubmit);
    
    form.querySelector('#cancel-btn').addEventListener('click', () => Modal.hide());
    
    Modal.show(formElement);
}

async function handleAddSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const phoneValue = formData.get('phoneNumber')?.replace(/\D/g, '');
    
    const formattedPhone = phoneValue?.length === 8 
        ? `${phoneValue.slice(0, 4)}-${phoneValue.slice(4)}` 
        : formData.get('phoneNumber');
    
    const data = {
        universityID: formData.get('universityID') || '',
        address: formData.get('address')?.trim() || '',
        phoneNumber: formattedPhone || '',
        isMainLocality: e.target.querySelector('#is-main-locality').checked || false
    };
    
    // Validaciones
    if (!data.universityID) {
        Toast.show('Debe seleccionar una universidad', 'warn');
        return;
    }
    
    if (!data.address || data.address.length === 0) {
        Toast.show('La dirección es requerida', 'warn');
        return;
    }
    
    if (data.address.length > 500) {
        Toast.show('La dirección no puede exceder 500 caracteres', 'warn');
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
    
    console.log('Datos a enviar (POST):', data);
    
    try {
        const response = await LocalitiesService.post(data);
        console.log('Respuesta POST:', response);
        Toast.show('Localidad creada exitosamente', 'success');
        Modal.hide();
        await loadLocalities();
    } catch (error) {
        console.error('Error al crear localidad:', error);
        
        // Manejo de errores mejorado
        if (error.response?.data) {
            const errorData = error.response.data;
            if (errorData.errors) {
                // Errores de validación
                const errorMessages = Object.values(errorData.errors).join(', ');
                Toast.show(errorMessages, 'error');
            } else if (errorData.message) {
                Toast.show(errorData.message, 'error');
            } else {
                Toast.show('Error al crear localidad', 'error');
            }
        } else {
            Toast.show(error.message || 'Error al crear localidad', 'error');
        }
    }
}

async function handleEditSubmit(e) {
    e.preventDefault();
    
    const id = e.target.dataset.editId;
    const formData = new FormData(e.target);
    const phoneValue = formData.get('phoneNumber')?.replace(/\D/g, '');
    
    // Formatear teléfono correctamente
    const formattedPhone = phoneValue?.length === 8 
        ? `${phoneValue.slice(0, 4)}-${phoneValue.slice(4)}` 
        : formData.get('phoneNumber');
    
    const data = {
        universityID: formData.get('universityID') || '',
        address: formData.get('address')?.trim() || '',
        phoneNumber: formattedPhone || '',
        // CRÍTICO: Asegurar que siempre sea boolean, nunca null/undefined
        isMainLocality: e.target.querySelector('#is-main-locality').checked || false
    };
    
    // Validaciones
    if (!data.universityID) {
        Toast.show('Debe seleccionar una universidad', 'warn');
        return;
    }
    
    if (!data.address || data.address.length === 0) {
        Toast.show('La dirección es requerida', 'warn');
        return;
    }
    
    if (data.address.length > 500) {
        Toast.show('La dirección no puede exceder 500 caracteres', 'warn');
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
    
    console.log('Datos a enviar (PUT):', data);
    
    try {
        const response = await LocalitiesService.put(id, data);
        console.log('Respuesta PUT:', response);
        Toast.show('Localidad actualizada exitosamente', 'success');
        Modal.hide();
        await loadLocalities();
    } catch (error) {
        console.error('Error al actualizar localidad:', error);
        
        // Manejo de errores mejorado
        if (error.response?.data) {
            const errorData = error.response.data;
            if (errorData.errors) {
                const errorMessages = Object.values(errorData.errors).join(', ');
                Toast.show(errorMessages, 'error');
            } else if (errorData.message) {
                Toast.show(errorData.message, 'error');
            } else {
                Toast.show('Error al actualizar localidad', 'error');
            }
        } else {
            Toast.show(error.message || 'Error al actualizar localidad', 'error');
        }
    }
}

await loadLocalities();