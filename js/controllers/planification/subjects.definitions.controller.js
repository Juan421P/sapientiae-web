import { SubjectDefinitionsService } from './../../services/subject-definitions.service';
import { SubjectFamiliesService } from './../../services/subject-families.service';

const subjectList = document.querySelector('#subject-list');
const searchInput = document.querySelector('#subject-search');
const addSubjectBtn = document.querySelector('#add-subject-btn');

let allSubjects = [];
let allFamilies = [];

function populateSubjects(subjects) {
    subjectList.innerHTML = subjects.length
        ? subjects.map(s => `
            <div class="subject-card p-6 bg-gradient-to-tr from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] rounded-xl shadow hover:shadow-lg hover:scale-[1.015] transition-transform duration-300 cursor-pointer flex flex-col min-w-[320px] max-w-[400px]" data-id="${s.subjectID || ''}">
                <div class="flex flex-col gap-4">
                    <!-- Título principal -->
                    <div class="pb-3">
                        <h2 class="font-bold bg-gradient-to-tr from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent text-xl mb-2 leading-tight">
                            ${s.subjectName || 'Sin nombre'}
                        </h2>
                    </div>

                    <!-- Información detallada -->
                    <div class="flex flex-col gap-3">
                        <!-- Código -->
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 stroke-[rgb(var(--button-from))]" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                <rect width="20" height="14" x="2" y="5" rx="2"/>
                                <line x1="2" x2="22" y1="10" y2="10"/>
                            </svg>
                            <span class="text-sm font-semibold bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent">
                                Código:
                            </span>
                            <span class="text-sm text-[rgb(var(--button-from))]/80">
                                ${s.subjectCode || 'N/A'}
                            </span>
                        </div>

                        <!-- Familia -->
                        <div class="flex items-start gap-2">
                            <svg class="w-4 h-4 stroke-[rgb(var(--button-from))] mt-0.5 flex-shrink-0" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                <path d="M3 3v18h18"/>
                                <path d="m19 9-5 5-4-4-3 3"/>
                            </svg>
                            <div class="flex flex-col gap-1">
                                <span class="text-sm font-semibold bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent">
                                    Familia:
                                </span>
                                <span class="inline-block px-2.5 py-1 text-xs rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-medium select-none drop-shadow-sm">
                                    ${s.subjectFamily || 'Sin asignar'}
                                </span>
                            </div>
                        </div>

                        <!-- ID -->
                        ${s.subjectID ? `
                            <div class="mt-2 pt-2">
                                <span class="text-xs text-[rgb(var(--placeholder-from))]/60 font-mono">
                                    ID: ${s.subjectID.substring(0, 8)}...
                                </span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('')
        : `
            <div class="text-center w-full py-10">
                <span class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] bg-clip-text text-transparent drop-shadow">
                    No hay definiciones de materias registradas.
                </span>
            </div>
        `;

    subjectList.querySelectorAll('.subject-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const subject = allSubjects.find(s => s.subjectID === id);
            
            ContextMenu.show([
                {
                    label: 'Ver detalles',
                    icon: 'view',
                    onClick: () => showViewModal(subject)
                },
                {
                    label: 'Editar',
                    icon: 'edit',
                    onClick: () => showEditModal(subject)
                },
                {
                    label: 'Eliminar',
                    icon: 'delete',
                    onClick: async () => {
                        const confirmed = await Toast.confirm('¿Estás seguro de eliminar esta materia?');
                        if (confirmed) {
                            try {
                                await SubjectDefinitionsService.delete(id);
                                Toast.show('Materia eliminada correctamente', 'success');
                                await loadSubjects();
                            } catch (error) {
                                Toast.show('Error al eliminar la materia', 'error');
                                console.error(error);
                            }
                        }
                    }
                }
            ]);
        });
    });
}

async function loadSubjects() {
    try {
        allSubjects = await SubjectDefinitionsService.get();
        console.log('Datos recibidos del backend:', allSubjects);
        console.log('Primer elemento:', allSubjects[0]);
        populateSubjects(allSubjects);
    } catch (error) {
        Toast.show('Error al cargar las materias', 'error');
        console.error(error);
        populateSubjects([]);
    }
}

async function loadFamilies() {
    try {
        const response = await SubjectFamiliesService.get();
        console.log('Respuesta cruda del backend:', response);
        
        // Verificar si la respuesta es un array o viene envuelta
        allFamilies = Array.isArray(response) ? response : (response.data || response.content || []);
        
        console.log('Familias procesadas:', allFamilies);
        console.log('Primera familia completa:', allFamilies[0]);
        console.log('Campos disponibles:', allFamilies[0] ? Object.keys(allFamilies[0]) : 'No hay familias');
        
        if (allFamilies.length === 0) {
            Toast.show('No hay familias de materias registradas. Por favor, crea una primero.', 'warn');
        }
    } catch (error) {
        Toast.show('Error al cargar las familias de materias', 'error');
        console.error('Error completo:', error);
        allFamilies = [];
    }
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        populateSubjects(allSubjects);
        return;
    }

    const filtered = allSubjects.filter(s => 
        (s.subjectName || '').toLowerCase().includes(searchTerm) ||
        (s.subjectCode || '').toLowerCase().includes(searchTerm) ||
        (s.subjectFamily || '').toLowerCase().includes(searchTerm)
    );

    populateSubjects(filtered);
});

function populateSelect(selectRoot, options = [], selectedValue = null) {
    if (!selectRoot) {
        console.error('selectRoot es null');
        return;
    }

    const menu = selectRoot.querySelector('[data-menu]');
    const text = selectRoot.querySelector('[data-text]');
    const input = selectRoot.querySelector('[data-input]');
    const chevron = selectRoot.querySelector('[data-chevron]');
    const btn = selectRoot.querySelector('[data-btn]');

    console.log('🔧 Populando select:', {
        menu: !!menu,
        text: !!text,
        input: !!input,
        chevron: !!chevron,
        btn: !!btn,
        options: options
    });

    if (!menu || !text || !input || !chevron || !btn) {
        console.error('Faltan elementos del select');
        return;
    }

    // Limpiar event listeners previos
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    menu.innerHTML = options.map(opt => {
        const value = typeof opt === 'object' ? opt.value : opt;
        const label = typeof opt === 'object' ? opt.label : opt;
        
        console.log('📝 Creando opción:', { value, label });
        
        return `
            <li class="px-4 py-2 cursor-pointer transition select-none 
                       bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] 
                       bg-clip-text text-transparent font-medium
                       hover:from-[rgb(var(--button-from))]/70 hover:to-[rgb(var(--button-to))]/70"
                data-value="${value}">
                ${label}
            </li>
        `;
    }).join('');

    newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = !menu.classList.contains('hidden');
        menu.classList.toggle('hidden', isOpen);
        chevron.classList.toggle('rotate-180', !isOpen);
    });

    document.addEventListener('click', (e) => {
        if (!selectRoot.contains(e.target)) {
            menu.classList.add('hidden');
            chevron.classList.remove('rotate-180');
        }
    });

    menu.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            const val = li.dataset.value;
            const label = li.textContent.trim();

            console.log('Opción seleccionada:', { value: val, label: label });

            text.textContent = label;
            text.classList.remove('italic', 'text-[rgb(var(--placeholder-from))]');
            text.classList.add('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'bg-clip-text', 'text-transparent');

            input.value = val;
            console.log('Valor guardado en input:', input.value);
            console.log('Nombre del input:', input.name);

            menu.classList.add('hidden');
            chevron.classList.remove('rotate-180');
        });
    });

    newBtn.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        text.textContent = 'Seleccione una familia';
        text.classList.add('italic', 'text-[rgb(var(--placeholder-from))]');
        text.classList.remove('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'bg-clip-text', 'text-transparent');
        input.value = '';
        console.log('Select reseteado');
    });

    if (selectedValue !== null && selectedValue !== undefined) {
        const found = options.find(opt => {
            const optValue = typeof opt === 'object' ? opt.value : opt;
            return String(optValue) === String(selectedValue);
        });
        
        if (found) {
            const label = typeof found === 'object' ? found.label : found;
            text.textContent = label;
            text.classList.remove('italic', 'text-[rgb(var(--placeholder-from))]');
            text.classList.add('bg-gradient-to-r', 'from-[rgb(var(--button-from))]', 'to-[rgb(var(--button-to))]', 'bg-clip-text', 'text-transparent');
            input.value = selectedValue;
            console.log('Valor preseleccionado:', selectedValue);
        }
    }
}

function showAddModal() {
    const template = document.querySelector('#tmpl-add-subject');
    if (!template) return;

    const formElement = template.content.querySelector('#subject-form').cloneNode(true);
    Modal.show(formElement);

    const selectRoot = formElement.querySelector('[data-select]');
    
    // Verificar que las familias estén cargadas
    if (!allFamilies || allFamilies.length === 0) {
        Toast.show('No hay familias de materias disponibles', 'error');
        console.error('No hay familias cargadas:', allFamilies);
        Modal.hide();
        return;
    }
    
    const familyOptions = allFamilies.map(f => ({
        value: f.subjectFamilyID || f.id,
        label: f.subjectFamilyName || f.name || 'Sin nombre'
    }));
    
    console.log('Agregando nueva materia');
    console.log('Familias disponibles:', allFamilies);
    console.log('Opciones formateadas:', familyOptions);
    
    populateSelect(selectRoot, familyOptions);

    formElement.querySelector('#cancel-btn').addEventListener('click', () => {
        Modal.hide();
    });

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(formElement);
        
        const subjectName = formData.get('subjectName')?.trim();
        const subjectCode = formData.get('subjectCode')?.trim();
        const subjectFamilyID = formData.get('subjectFamilyID')?.trim();

        console.log('Datos del formulario:');
        console.log('  - Nombre:', subjectName);
        console.log('  - Código:', subjectCode);
        console.log('  - Familia ID:', subjectFamilyID);

        if (!subjectName) {
            Toast.show('El nombre de la materia es requerido', 'warn');
            return;
        }

        if (!subjectCode) {
            Toast.show('El código de la materia es requerido', 'warn');
            return;
        }

        if (!subjectFamilyID || subjectFamilyID === 'undefined' || subjectFamilyID === 'null') {
            Toast.show('Debe seleccionar una familia de materia', 'warn');
            console.error('Familia no seleccionada correctamente');
            return;
        }

        const data = {
            subjectName: subjectName,
            subjectCode: subjectCode,
            subjectFamilyID: subjectFamilyID
        };

        console.log('Enviando nueva materia:', data);

        try {
            const response = await SubjectDefinitionsService.post(data);
            console.log('Respuesta del servidor:', response);
            Toast.show('Materia creada correctamente', 'success');
            Modal.hide();
            await loadSubjects();
        } catch (error) {
            console.error('Error completo:', error);
            
            if (error.message) {
                Toast.show(error.message, 'error');
            } else if (error.status === 409) {
                Toast.show('Ya existe una materia con ese código', 'error');
            } else if (error.status === 500) {
                Toast.show('Error del servidor. Verifica que la familia de materia exista', 'error');
            } else {
                Toast.show('Error al crear la materia', 'error');
            }
        }
    });
}

function showEditModal(subject) {
    const template = document.querySelector('#tmpl-add-subject');
    if (!template) return;

    const formElement = template.content.querySelector('#subject-form').cloneNode(true);
    
    formElement.querySelector('.text-3xl').textContent = 'Editar materia';
    formElement.querySelector('.text-xl').textContent = 'Modifica los campos necesarios';
    
    Modal.show(formElement);

    // Llenar los campos
    formElement.querySelector('#subject-name').value = subject.subjectName || '';
    formElement.querySelector('#subject-code').value = subject.subjectCode || '';

    // Preparar el select
    const selectRoot = formElement.querySelector('[data-select]');
    const familyOptions = allFamilies.map(f => ({
        value: f.subjectFamilyID || f.id,
        label: f.subjectPrefix || f.name || 'Sin nombre'
    }));
    
    console.log('Editando materia:', subject);
    console.log('Familia actual:', subject.subjectFamilyID);
    console.log('Opciones disponibles:', familyOptions);
    
    populateSelect(selectRoot, familyOptions, subject.subjectFamilyID);

    formElement.querySelector('#cancel-btn').addEventListener('click', () => {
        Modal.hide();
    });

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(formElement);
        
        // IMPORTANTE: El DTO del backend necesita TAMBIÉN el subjectID para actualizar
        const data = {
            subjectID: subject.subjectID, // ← ESTO ES CRÍTICO
            subjectName: formData.get('subjectName')?.trim(),
            subjectCode: formData.get('subjectCode')?.trim(),
            subjectFamilyID: formData.get('subjectFamilyID')?.trim()
        };

        console.log('Enviando actualización:', data);
        console.log('ID de la materia:', subject.subjectID);

        if (!data.subjectName || !data.subjectCode || !data.subjectFamilyID) {
            Toast.show('Todos los campos son requeridos', 'warn');
            return;
        }

        try {
            const response = await SubjectDefinitionsService.put(subject.subjectID, data);
            console.log('Respuesta del servidor:', response);
            Toast.show('Materia actualizada correctamente', 'success');
            Modal.hide();
            await loadSubjects();
        } catch (error) {
            console.error('Error completo:', error);
            
            // Mostrar el mensaje de error del servidor
            if (error.message) {
                Toast.show(error.message, 'error');
            } else if (error.status === 409) {
                Toast.show('Ya existe otra materia con ese código', 'error');
            } else if (error.status === 404) {
                Toast.show('Materia no encontrada', 'error');
            } else {
                Toast.show('Error al actualizar la materia', 'error');
            }
        }
    });
}

function showViewModal(subject) {
    const template = document.querySelector('#tmpl-view-subject');
    if (!template) return;

    const viewElement = template.content.cloneNode(true).querySelector('div');
    
    viewElement.querySelector('#view-title').textContent = subject.subjectName || 'Sin nombre';
    viewElement.querySelector('#view-code').textContent = subject.subjectCode || 'Sin código';
    viewElement.querySelector('#view-family').textContent = subject.subjectFamily || 'Sin familia asignada';

    Modal.show(viewElement);

    viewElement.querySelector('#close-view-btn').addEventListener('click', () => {
        Modal.hide();
    });
}

addSubjectBtn.addEventListener('click', showAddModal);

await loadFamilies();
await loadSubjects();