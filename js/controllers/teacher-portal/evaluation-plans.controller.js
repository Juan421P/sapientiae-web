import { EvaluationPlansService } from '../../services/evaluation-plans.service.js';
import { EvaluationPlanComponentsService } from '../../services/evaluation-plan-components.service.js';
import { CourseOfferingService } from '../../services/course-offerings.service.js';
import { Modal } from './../../../components/modal.js';
import { Toast } from './../../../components/toast.js';

const $ = (sel, root = document) => root.querySelector(sel);

let OFFERINGS_BY_ID = new Map();

function labelFromOffering(off) {
  if (!off) return '';
 
  const subject = off.subject || off.subjectName || 'Curso';
  const cycle   = off.yearcycleName || off.yearCycleName || '';
  
  return [subject, cycle].filter(Boolean).join(' — ');
}

async function warmOfferingsCache() {
  try {
    const list = await CourseOfferingService.get();      
    OFFERINGS_BY_ID = new Map((list || []).map(o => [
      (o.courseOfferingID || o.id),
      o
    ]));
  } catch (e) {
    OFFERINGS_BY_ID = new Map();
    console.error('[Offerings] no se pudieron cargar:', e);
  }
}

function mapPlan(dto) {
  const id    = dto.evaluationPlanID || dto.evaluationPlanId || dto.id;
  const title = dto.planName || dto.nombre || 'Plan de Evaluación';
  const description = dto.description || '';

  const courseOfferingID =
    dto.courseOfferingID || dto.courseOfferingId ||
    dto.courseOffering?.courseOfferingID || null;

  const offering = dto.courseOffering || OFFERINGS_BY_ID.get(courseOfferingID) || null;

  const period = offering ? labelFromOffering(offering) : (dto.period || '—');

  const createdAt = dto.createdAt || dto.createDate || null;

  return { id, title, period, description, offering, courseOfferingID, createdAt };
}

export async function init() {
  try {
    $('#create-plan-btn')?.addEventListener('click', openCreateModal);

    document.addEventListener('click', () => {
      document.querySelectorAll('.context-menu').forEach(m => m.classList.add('hidden'));
    });

    await loadAndRender();
  } catch (e) {
    console.error('[EvaluationPlans] init error:', e);
    Toast.show('No se pudieron cargar los planes.', 'error');
  }
}

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

  await warmOfferingsCache();

  let plans = [];
  let comps = [];
  try {
    const [plansRes, compsRes] = await Promise.all([
      EvaluationPlansService.getAll(),
      EvaluationPlanComponentsService.getAll()
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

  plans.forEach(dto => {
    const plan = mapPlan(dto);
    plan.evaluations = (compsByPlan.get(plan.id) || []).slice();

    const tpl = document.importNode($('#tmpl-plan-card').content, true);

    $('#plan-title', tpl).textContent = plan.title;
    $('#plan-period', tpl).textContent = plan.period;
    $('#plan-description', tpl).textContent = plan.description || '—';
    $('#plan-evaluations', tpl).innerHTML =
      (plan.evaluations || []).map(e => `<li>${escapeHTML(e)}</li>`).join('');

    
    $('.view-plan-btn', tpl).addEventListener('click', () => openPlanDetail(plan));
    $('.edit-plan-btn', tpl).addEventListener('click', () => openEditModal(plan));

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

    container.appendChild(tpl);
  });

  updateTimelineHeight();
}

async function openPlanDetail(plan) {
  const tpl = document.importNode($('#tmpl-plan-detail').content, true);
  $('#detail-title', tpl).textContent = plan.title;
  $('#detail-period', tpl).textContent = plan.period;
  $('#detail-description', tpl).textContent = plan.description || '—';
  $('#detail-evaluations', tpl).innerHTML =
    (plan.evaluations || []).map(e => `<li>${escapeHTML(e)}</li>`).join('');

  Modal.show(tpl.firstElementChild || tpl);
}

async function openCreateModal() {
  const tpl = document.importNode($('#tmpl-create-plan').content, true);
  Modal.show(tpl.firstElementChild || tpl);
  await new Promise(r => requestAnimationFrame(r)); // esperar a que esté en el DOM

  const form = document.querySelector('#plan-form');
  const sel  = document.querySelector('#form-courseOffering');

  if (sel) {
    sel.innerHTML = '<option value="">Selecciona un curso…</option>';
    if (OFFERINGS_BY_ID.size) {
      for (const off of OFFERINGS_BY_ID.values()) {
        const opt = document.createElement('option');
        opt.value = off.courseOfferingID || off.id;
        opt.textContent = labelFromOffering(off);
        sel.appendChild(opt);
      }
    } else {
      sel.innerHTML = '<option value="">— No hay cursos disponibles —</option>';
    }
  }

  document.querySelector('#cancel-plan-btn')?.addEventListener('click', () => Modal.hide());

  form?.addEventListener('submit', async e => {
    e.preventDefault();

    const planName    = document.querySelector('#form-title')?.value.trim() || '';
    const description = document.querySelector('#form-description')?.value.trim() || '';
    const courseOfferingID = document.querySelector('#form-courseOffering')?.value || '';

    if (!courseOfferingID) { Toast.show('Selecciona un curso.', 'warn'); return; }
    if (!planName)         { Toast.show('Escribe el título del plan.', 'warn'); return; }

    try {
      await EvaluationPlansService.create({ courseOfferingID, planName, description });
      Toast.show('Plan creado con éxito.', 'success');
      Modal.hide();
      await loadAndRender();
    } catch (err) {
      console.error('[Create] fallo:', err);
      Toast.show('No se pudo crear el plan.', 'error');
    }
  });
}

function normalizeDateForAPI(v) {
  try {
    const d = v ? new Date(v) : new Date();
    if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
    return d.toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}


async function openEditModal(plan) {
  const tpl = document.importNode($('#tmpl-create-plan').content, true);
  Modal.show(tpl.firstElementChild || tpl);
  await new Promise(r => requestAnimationFrame(r));

  document.querySelector('#form-title').value       = plan.title || '';
  document.querySelector('#form-description').value = plan.description || '';

  const sel = document.querySelector('#form-courseOffering');
  if (sel) {
    sel.innerHTML = `<option>${plan.period || '—'}</option>`;
    sel.disabled = true;
  }

  document.querySelector('#cancel-plan-btn')?.addEventListener('click', () => Modal.hide());

  document.querySelector('#plan-form')?.addEventListener('submit', async e => {
    e.preventDefault();


    const payload = {
      planName:        document.querySelector('#form-title')?.value.trim() || '',
      description:     document.querySelector('#form-description')?.value.trim() || '',
      courseOfferingID: plan.courseOfferingID || plan.offering?.courseOfferingID || null,
      createdAt:       normalizeDateForAPI(plan.createdAt)
    };

    if (!payload.courseOfferingID) delete payload.courseOfferingID;

    try {
      await EvaluationPlansService.update(plan.id, payload);
      Toast.show('Plan actualizado.', 'success');
      Modal.hide();
      await loadAndRender();
    } catch (err) {
      console.error('[Update] fallo:', err);
      Toast.show('No se pudo actualizar el plan.', 'error');
    }
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
