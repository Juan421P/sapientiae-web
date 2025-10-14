import { EvaluationPlansService } from '../../services/evaluation-plans.service.js';
import { EvaluationPlanComponentsService } from '../../services/evaluation-plan-components.service.js';
import { Modal } from './../../../components/modal.js';
import { Toast } from './../../../components/toast.js';

const $ = (sel, root = document) => root.querySelector(sel);


export async function init() {
  try {
    // Eventos UI
    $('#create-plan-btn')?.addEventListener('click', openCreateModal);

    // Cerrar menús contextuales simples al hacer click fuera
    document.addEventListener('click', () => {
      document.querySelectorAll('.context-menu').forEach(m => m.classList.add('hidden'));
    });

    await loadAndRender();
  } catch (e) {
    console.error('[EvaluationPlans] init error:', e);
    Toast.show('No se pudieron cargar los planes.', 'error');
  }
}

// Auto-init
if (document.readyState !== 'loading') {
  init().catch(console.error);
} else {
  document.addEventListener('DOMContentLoaded', () => init().catch(console.error));
}


async function loadAndRender() {
  const container = $('#plans-container');
  container.innerHTML = `
    <div id="timeline-line" class="absolute left-4 w-1 bg-gradient-to-r from-[rgb(var(--off-from))] to-[rgb(var(--off-to))] rounded-full"></div>
  `;

  let plans = [];
  let comps = [];
  try {
    // Credenciales: el Network ya manda credentials: 'include'
    const [plansRes, compsRes] = await Promise.all([
      EvaluationPlansService.getAll(),                // /api/EvaluationPlans/getEvaluationPlan
      EvaluationPlanComponentsService.getAll()        // /api/EvaluationPlanComponents/getEvaluationPlanComponents
    ]);
    plans = Array.isArray(plansRes) ? plansRes : [];
    comps  = Array.isArray(compsRes)  ? compsRes  : [];
  } catch (e) {
    console.error('[EvaluationPlans] fetch failed:', e);
    Toast.show('Error obteniendo datos del servidor.', 'error');
    return;
  }

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

  // --- Agrupar componentes por planId ---
  const getCompPlanId = c =>
    c.evaluationPlanID || c.evaluationPlanId || c.planId || c.planID || c.idPlan || null;

  const getCompName = c =>
    c.componentName || c.nombre || c.name || `Componente #${c.orderIndex ?? ''}`.trim();

  const compsByPlan = new Map();
  comps.forEach(c => {
    const pid = getCompPlanId(c);
    if (!pid) return;
    if (!compsByPlan.has(pid)) compsByPlan.set(pid, []);
    compsByPlan.get(pid).push(getCompName(c));
  });

  // --- Render cards ---
  plans.forEach(dto => {
    const plan = mapPlan(dto);
    plan.evaluations = (compsByPlan.get(plan.id) || []).slice();

    const tpl = document.importNode($('#tmpl-plan-card').content, true);

    // Rellenar
    $('#plan-title', tpl).textContent = plan.title;
    $('#plan-period', tpl).textContent = plan.period;
    $('#plan-description', tpl).textContent = plan.description || '—';
    $('#plan-evaluations', tpl).innerHTML =
      (plan.evaluations || []).map(e => `<li>${escapeHTML(e)}</li>`).join('');

    // Acciones
    $('.view-plan-btn', tpl).addEventListener('click', () => openPlanDetail(plan));
    $('.edit-plan-btn', tpl).addEventListener('click', () => openEditModal(plan));

    // mini context-menu local
    const btn = $('.context-menu-btn', tpl);
    const menu = $('.context-menu', tpl);
    btn.addEventListener('click', ev => {
      ev.stopPropagation();
      document.querySelectorAll('.context-menu').forEach(m => m.classList.add('hidden'));
      menu.classList.toggle('hidden');
    });
    $('.ctx-duplicate', menu).addEventListener('click', () => {
      menu.classList.add('hidden');
      Toast.show('Función "Duplicar plan" (UI)', 'info');
    });
    $('.ctx-add-eval', menu).addEventListener('click', () => {
      menu.classList.add('hidden');
      Toast.show('Función "Agregar evaluación" (UI)', 'info');
    });

    // Añadir al DOM
    container.appendChild(tpl);
  });

  updateTimelineHeight();
}


function mapPlan(dto) {
  const id =
    dto.evaluationPlanID || dto.evaluationPlanId || dto.id || dto.uuid || dto.codigo || dto.code;

  const title =
    dto.planName || dto.nombre || dto.name || dto.titulo || dto.title || 'Plan de Evaluación';

  const year =
    dto.year || dto.anio || dto.academicYear || dto.yearLabel;

  const cycle =
    dto.cycle || dto.ciclo || dto.cycleLabel || dto.cycleType;

  const period = [cycle, year].filter(Boolean).join(' - ')
               || dto.period || dto.periodo || '—';

  const description =
    dto.description || dto.descripcion || dto.detalle || '';

  return { id, title, period, description, evaluations: [] };
}

async function openPlanDetail(plan) {
  const tpl = document.importNode($('#tmpl-plan-detail').content, true);
  $('#detail-title', tpl).textContent = plan.title;
  $('#detail-period', tpl).textContent = plan.period;
  $('#detail-description', tpl).textContent = plan.description || '—';
  $('#detail-evaluations', tpl).innerHTML =
    (plan.evaluations || []).map(e => `<li>${escapeHTML(e)}</li>`).join('');

  // Mostrar modal
  Modal.show(tpl.firstElementChild ? tpl.firstElementChild : tpl);
}

async function openCreateModal() {
  const tpl = document.importNode($('#tmpl-create-plan').content, true);
  const form = tpl.querySelector('#plan-form');

  // Botón cancelar
  tpl.querySelector('#cancel-plan-btn')?.addEventListener('click', () => Modal.hide());

  // Guardar (WIP: ajusta payload al DTO de tu backend si ya lo tienes)
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    Toast.show('Define los campos del DTO para guardar (create).', 'warn');

    // Ejemplo (ajústalo luego a tu DTO real):
    // const payload = {
    //   planName: tpl.querySelector('#form-title').value,
    //   description: tpl.querySelector('#form-description').value,
    //   period: tpl.querySelector('#form-period').value
    // };
    // await EvaluationPlansService.create(payload);
    // await loadAndRender();

    Modal.hide();
  });

  // Mostrar modal
  Modal.show(tpl.firstElementChild ? tpl.firstElementChild : tpl);
}

async function openEditModal(plan) {
  const tpl = document.importNode($('#tmpl-create-plan').content, true);

  // Precarga
  tpl.querySelector('#form-title').value = plan.title || '';
  tpl.querySelector('#form-period').value = plan.period || '';
  tpl.querySelector('#form-description').value = plan.description || '';

  tpl.querySelector('#cancel-plan-btn')?.addEventListener('click', () => Modal.hide());
  tpl.querySelector('#plan-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    Toast.show('Define el DTO para actualizar (update).', 'warn');



    Modal.hide();
  });

  Modal.show(tpl.firstElementChild ? tpl.firstElementChild : tpl);
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
