// Controller: Evaluaciones (vista tipo tarjetas)
// Depende de: StudentEvaluationsService, Modal (estático), Toast (estático)

import { StudentEvaluationsService } from '../../services/student-evaluations.service.js';
import { Modal } from './../../../components/modal.js';
import { Toast } from './../../../components/toast.js';

const $ = (sel, root = document) => root.querySelector(sel);

/* =========================
   Bootstrap
========================= */
async function init() {
  await loadAndRender();

  const createBtn = $('#create-eval-btn');
  if (createBtn) createBtn.addEventListener('click', openCreateModal);

  // seguridad extra: cerrar modal con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') Modal.hide?.();
  });
}

/* =========================
   Render principal
========================= */
async function loadAndRender() {
  const grid = $('#evals-grid');
  if (!grid) {
    console.error('[Evaluations] No existe #evals-grid en el DOM');
    return;
  }
  grid.innerHTML = '';

  let data = [];
  try {
    const res = await StudentEvaluationsService.getAll(); // 200 -> lista, 204 -> []
    data = Array.isArray(res) ? res : [];
  } catch (e) {
    console.error('[Evaluations] getAll falló:', e);
    if (e?.status === 403) {
      Toast.show('No tienes permisos para ver Evaluaciones (403). Revisa tu rol o vuelve a iniciar sesión.', 'warn');
    } else {
      Toast.show('No se pudieron cargar las evaluaciones.', 'error');
    }
    return;
  }

  const evaluations = data.map(mapEval);

  if (!evaluations.length) {
    grid.insertAdjacentHTML('beforeend', emptyState());
    return;
  }

  const cardTpl = $('#tmpl-eval-card');
  if (!cardTpl) {
    console.error('[Evaluations] Falta template #tmpl-eval-card');
    return;
  }

  evaluations.forEach(ev => {
    const frag = document.importNode(cardTpl.content, true);

    $('#eval-title', frag).textContent = ev.title;
    $('#eval-date',  frag).textContent = ev.dateLabel;
    $('#eval-desc',  frag).textContent = ev.description || '—';
    $('#eval-topics', frag).innerHTML  = ev.topics.map(li).join('');
    $('#eval-qtypes', frag).innerHTML  = ev.questionTypes.map(li).join('');

    // botones
    $('.btn-edit-eval', frag)?.addEventListener('click', () => openEditModal(ev));
    $('.btn-results-eval', frag)?.addEventListener('click', () => {
      Toast.show('Resultados: pendiente.', 'info');
    });

    grid.appendChild(frag);
  });
}

/* =========================
   Mapear DTO -> VM
========================= */
function mapEval(dto) {
  // IDs y campos tolerantes a nombres
  const id =
    dto.evaluationId || dto.evaluationID || dto.id || dto.codigo;

  const title =
    dto.title || dto.evaluationTitle || dto.nombre || dto.name || dto.evaluationName || 'Evaluación';

  const date =
    dto.evalDate || dto.evaluationDate || dto.date || dto.fecha || null;

  const desc =
    dto.description || dto.descripcion || '';

  // Temas evaluados
  const topicsRaw =
    dto.topics || dto.temas || dto.topicsEvaluated || dto.temasEvaluados || [];

  // Tipos de preguntas
  const qtypesRaw =
    dto.questionTypes || dto.tiposPreguntas || dto.tipos || [];

  const topics = normalizeList(topicsRaw);
  const qtypes = normalizeList(qtypesRaw);

  return {
    id,
    title,
    description: desc,
    dateISO: date ? String(date) : null,
    dateLabel: date ? formatDateLabel(date) : '',
    topics,
    questionTypes: qtypes
  };
}

function normalizeList(v) {
  if (Array.isArray(v)) return v.map(String);
  return String(v ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

function formatDateLabel(d) {
  try {
    const dt = new Date(d);
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yyyy = dt.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch { return String(d); }
}

function li(text) {
  return `<li>${escapeHTML(text)}</li>`;
}

function escapeHTML(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function emptyState() {
  return `
    <div class="p-6 rounded-xl bg-gradient-to-br from-[rgb(var(--card-from))] to-[rgb(var(--card-to))] border border-[rgb(var(--off-from))]">
      <p class="text-sm bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">
        Aún no hay evaluaciones registradas.
      </p>
    </div>`;
}

/* =========================
   Modales (usa Modal estático)
========================= */
async function openCreateModal() {
  const tpl = $('#tmpl-create-eval');
  if (!tpl) {
    console.error('[Evaluations] Falta template #tmpl-create-eval');
    return;
  }

  const formEl = document.importNode(tpl.content, true).firstElementChild; // <form id="eval-form">
  Modal.show(formEl);

  formEl.querySelector('#cancel-eval-btn')?.addEventListener('click', () => Modal.hide());
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = buildPayloadFromForm(formEl);

    try {
      await StudentEvaluationsService.create(payload);
      Toast.show('Evaluación creada.', 'success', 3500);
      Modal.hide();
      await loadAndRender();
    } catch (err) {
      console.error('[Evaluations] create falló:', err);
      const msg = err?.status === 403
        ? 'Sin permisos para crear evaluaciones (403).'
        : 'No se pudo crear la evaluación.';
      Toast.show(msg, 'error');
    }
  });
}

async function openEditModal(ev) {
  const tpl = $('#tmpl-create-eval');
  if (!tpl) {
    console.error('[Evaluations] Falta template #tmpl-create-eval');
    return;
  }

  const formEl = document.importNode(tpl.content, true).firstElementChild;

  // precargar
  formEl.querySelector('#f-title').value  = ev.title || '';
  formEl.querySelector('#f-desc').value   = ev.description || '';
  formEl.querySelector('#f-date').value   = ev.dateISO ? ev.dateISO.slice(0, 10) : '';
  formEl.querySelector('#f-topics').value = ev.topics.join(', ');
  formEl.querySelector('#f-qtypes').value = ev.questionTypes.join(', ');

  Modal.show(formEl);

  formEl.querySelector('#cancel-eval-btn')?.addEventListener('click', () => Modal.hide());
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = buildPayloadFromForm(formEl);
    try {
      await StudentEvaluationsService.update(ev.id, payload);
      Toast.show('Evaluación actualizada.', 'success', 3500);
      Modal.hide();
      await loadAndRender();
    } catch (err) {
      console.error('[Evaluations] update falló:', err);
      const msg = err?.status === 403
        ? 'Sin permisos para actualizar (403).'
        : 'No se pudo actualizar la evaluación.';
      Toast.show(msg, 'error');
    }
  });
}

function buildPayloadFromForm(root) {
  // Ajusta los nombres si tu DTO usa otros exactos en el backend
  const topics = root.querySelector('#f-topics').value
    .split(',').map(s => s.trim()).filter(Boolean);
  const qtypes = root.querySelector('#f-qtypes').value
    .split(',').map(s => s.trim()).filter(Boolean);

  return {
    title: root.querySelector('#f-title').value?.trim(),
    description: root.querySelector('#f-desc').value?.trim(),
    evalDate: root.querySelector('#f-date').value, // yyyy-mm-dd
    topics,
    questionTypes: qtypes
  };
}

/* =========================
   Auto-init
========================= */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init().catch(console.error));
} else {
  init().catch(console.error);
}
