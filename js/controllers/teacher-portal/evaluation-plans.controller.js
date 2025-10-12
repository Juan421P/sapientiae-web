/*
import { EvaluationPlansService } from '../../services/evaluation-plans.service.js';
import { Modal } from '../../components/modal.js';
import { Toast } from '../../components/toast.js';

const $ = (sel, root = document) => root.querySelector(sel);

export async function init() {
  await loadAndRender();

  $('#create-plan-btn')?.addEventListener('click', openCreateModal);

  // cerrar menús contextuales si se hace click fuera
  document.addEventListener('click', () => {
    document.querySelectorAll('.context-menu').forEach(m => m.classList.add('hidden'));
  });
}

async function loadAndRender() {
  const container = $('#plans-container');
  container.innerHTML = `<div id="timeline-line" class="absolute left-4 w-1 bg-gradient-to-r from-[rgb(var(--off-from))] to-[rgb(var(--off-to))] rounded-full"></div>`;

  let data;
  try {
    data = await EvaluationPlansService.getAll(); // 200 = lista | 204 = vacío
  } catch (e) {
    console.error('[EvaluationPlans] falló getAll:', e);
    new Toast('No se pudieron cargar los planes.').show();
    return;
  }

  // si la API devolvió 204 No Content, Network.get probablemente haya devuelto null/undefined
  const plans = Array.isArray(data) ? data : [];

  if (!plans.length) {
    container.insertAdjacentHTML(
      'beforeend',
      `<div class="p-6 rounded-xl bg-gradient-to-br from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] border border-[rgb(var(--off-from))]">
         <p class="text-sm bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
           No hay planes de evaluación registrados.
         </p>
       </div>`
    );
    updateTimelineHeight();
    return;
  }

  plans.forEach(dto => {
    // Mapeo tolerante: usa lo que venga; si falta, muestra algo razonable
    const plan = mapPlan(dto);

    const tpl = document.importNode($('#tmpl-plan-card').content, true);
    $('.context-menu', tpl)?.classList.add('hidden');

    $('#plan-title', tpl).textContent = plan.title;
    $('#plan-period', tpl).textContent = plan.period;
    $('#plan-description', tpl).textContent = plan.description || '—';

    const evalList = $('#plan-evaluations', tpl);
    evalList.innerHTML = (plan.evaluations || []).map(e => `<li>${escapeHTML(e)}</li>`).join('');

    // detalle
    $('.view-plan-btn', tpl).addEventListener('click', () => openPlanDetail(plan));

    // editar (por ahora: solo precarga el form; cuando tengamos DTO exacto, hacemos PUT)
    $('.edit-plan-btn', tpl).addEventListener('click', () => openEditModal(plan));

    // menú contextual minimal
    const btn = $('.context-menu-btn', tpl);
    const menu = $('.context-menu', tpl);
    btn.addEventListener('click', ev => {
      ev.stopPropagation();
      document.querySelectorAll('.context-menu').forEach(m => m.classList.add('hidden'));
      menu.classList.toggle('hidden');
    });
    $('.ctx-duplicate', menu).addEventListener('click', () => {
      menu.classList.add('hidden');
      // demo local (solo UI). Cuando definas el endpoint de duplicar, se llama aquí.
      new Toast('Función "Duplicar plan" (UI)').show();
    });
    $('.ctx-add-eval', menu).addEventListener('click', () => {
      menu.classList.add('hidden');
      new Toast('Función "Agregar evaluación" (UI)').show();
    });

    container.appendChild(tpl);
  });

  updateTimelineHeight();
}

function mapPlan(dto) {
  // Intenta cubrir nombres comunes sin inventar estructura fija
  const title =
    dto.nombre ||
    dto.name ||
    dto.titulo ||
    dto.title ||
    dto.planName ||
    'Plan de Evaluación';

  const year =
    dto.year || dto.anio || dto.anioLectivo || dto.academicYear || dto.yearLabel;

  const cycle =
    dto.cycle || dto.ciclo || dto.cycleName || dto.cycleLabel || dto.cycleType;

  const period = [cycle, year].filter(Boolean).join(' - ') || (dto.period || dto.periodo || '—');

  const description =
    dto.descripcion || dto.description || dto.detalle || dto.summary || '';

  const evaluations =
    dto.evaluations ||
    dto.componentes ||
    dto.items ||
    []; // si vienen objetos, conviértelos a texto
  const evalStrings = Array.isArray(evaluations)
    ? evaluations.map(e => (typeof e === 'string' ? e : (e?.nombre || e?.name || e?.titulo || 'Evaluación')))
    : [];

  return {
    id: dto.id || dto.uuid || dto.codigo || dto.code,
    title,
    period,
    description,
    evaluations: evalStrings
  };
}

async function openPlanDetail(plan) {
  const tpl = document.importNode($('#tmpl-plan-detail').content, true);
  $('#detail-title', tpl).textContent = plan.title;
  $('#detail-period', tpl).textContent = plan.period;
  $('#detail-description', tpl).textContent = plan.description || '—';
  $('#detail-evaluations', tpl).innerHTML = (plan.evaluations || []).map(e => `<li>${escapeHTML(e)}</li>`).join('');

  const modal = new Modal({ size: 'md', content: tpl });
  await modal.open();
}

async function openCreateModal() {
  const modal = new Modal({ templateId: 'tmpl-create-plan', size: 'sm' });
  await modal.open();

  $('#cancel-plan-btn')?.addEventListener('click', () => modal.close());
  $('#plan-form')?.addEventListener('submit', async e => {
    e.preventDefault();

    // ⚠️ A la espera del DTO exacto. Por ahora, mostramos aviso.
    new Toast('Define los campos del DTO para guardar (create).').show();

    // Ejemplo de payload (ajústalo al DTO cuando lo tengas):
    // const payload = {
    //   nombre: $('#form-title').value,
    //   descripcion: $('#form-description').value,
    //   periodo: $('#form-period').value
    // };
    // await EvaluationPlansService.create(payload);

    modal.close();
    // await loadAndRender();
  });
}

async function openEditModal(plan) {
  const modal = new Modal({ templateId: 'tmpl-create-plan', size: 'sm' });
  await modal.open();

  // precarga
  $('#form-title').value = plan.title || '';
  $('#form-period').value = plan.period || '';
  $('#form-description').value = plan.description || '';

  $('#cancel-plan-btn')?.addEventListener('click', () => modal.close());
  $('#plan-form')?.addEventListener('submit', async e => {
    e.preventDefault();

    new Toast('Define el DTO para actualizar (update).').show();

    // const payload = { ... };
    // await EvaluationPlansService.update(plan.id, payload);

    modal.close();
    // await loadAndRender();
  });
}

function updateTimelineHeight() {
  const container = $('#plans-container');
  const cards = container.querySelectorAll('#plan-card');
  const line = container.querySelector('#timeline-line');
  const dotCenterOffsetFromCardTop = 38;

  if (cards.length > 0 && line) {
    const firstCardTop = cards[0].offsetTop;
    const lastCardTop = cards[cards.length - 1].offsetTop;
    const lineStartY = firstCardTop + dotCenterOffsetFromCardTop;
    const lineEndY = lastCardTop + dotCenterOffsetFromCardTop;
    line.style.top = `${lineStartY}px`;
    line.style.height = `${lineEndY - lineStartY}px`;
  } else if (line) {
    line.style.height = '0px';
    line.style.top = '0px';
  }
}

function escapeHTML(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
*/