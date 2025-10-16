// js/controllers/teacher-portal/courses.controller.js
import { CourseOfferingsTeachersService } from "../../services/course-offering-teachers.service.js";
import { CourseOfferingService }         from "../../services/course-offerings.service.js"; // usa get() o getAll()
import { SubjectDefinitionsService }      from "../../services/subject-definitions.service.js";
import { YearCyclesService }              from "../../services/year-cycles.service.js";
import { CycleTypesService }              from "../../services/cycle-types.service.js";
import { CourseEnrollmentsService }       from "../../services/course-enrollments.service.js";
import { StudentsService }                from "../../services/students.service.js";
import { PeopleService }                  from "../../services/people.service.js";
import { Toast }                          from "../../../components/toast.js";
import { Modal }                          from "../../../components/modal.js";

/* ------------------------------- Referencias ---------------------------- */
const thead   = document.querySelector('#thead');   // se rellena en boot()
const tbody   = document.querySelector('#tbody');
const HEADERS = ['Materia', 'Grupo', 'Ciclo académico', 'Estudiantes'];

/* -------------------------------- Helpers ------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);

const byId = (arr, key1, key2) => {
  const m = new Map();
  for (const x of arr || []) {
    const id = x?.[key1] ?? x?.[key2] ?? x?.id;
    if (id) m.set(id, x);
  }
  return m;
};

function buildCycleLabel(yc, ct) {
  if (!yc) return '—';
  const year = yc.year ?? yc.academicYear ?? yc.yearName ?? '';
  const num  = yc.cycleNumber ?? yc.number ?? yc.cycle ?? '';
  const type = ct?.name ?? ct?.cycleTypeName ?? 'Ciclo';
  if (year && num) return `${type} ${String(num).padStart(2,'0')}/${year}`;
  return yc.name ?? yc.yearCycleName ?? '—';
}

function mapRow(c) {
  return {
    id: c.id,
    subject: c.subjectName ?? '—',
    group: c.group ?? '—',
    cycle: c.cycle ?? '—',
    classroom: c.classroom ?? '—',
    schedule: c.schedule ?? '—',
    studentCount: Number.isFinite(c.studentCount) ? c.studentCount : 0,
  };
}

function mapStudentRow(s, i) {
  const candidate = s?.fullName ?? s?.name ?? `${s?.firstName ?? ''} ${s?.lastName ?? ''}`.trim();
  const full = (candidate?.trim?.() || '—');

  return `
    <tr>
      <td class="px-5 py-3 text-[rgb(var(--button-from))]">${i + 1}</td>
      <td class="px-5 py-3 text-[rgb(var(--button-from))]">${full}</td>
    </tr>
  `;
}

/* -------------------- Carga SOLO con getAll()/get() --------------------- */
async function loadCoursesForTeacher(teacherId) {
  // 1) descargo TODO (defensivo: get() o getAll())
  const [
    linksAll,            // relaciones oferta-docente
    offeringsAll,        // ofertas
    subjectsAll,         // materias
    yearCyclesAll,       // ciclos
    cycleTypesAll,       // tipos de ciclo
    enrollmentsAll       // inscripciones a ofertas
  ] = await Promise.all([
    (CourseOfferingsTeachersService.get?.() ?? CourseOfferingsTeachersService.getAll?.() ?? Promise.resolve([])),
    (CourseOfferingService.get?.()         ?? CourseOfferingService.getAll?.()         ?? Promise.resolve([])),
    (SubjectDefinitionsService.get?.()     ?? SubjectDefinitionsService.getAll?.()      ?? Promise.resolve([])),
    (YearCyclesService.get?.()             ?? YearCyclesService.getAll?.()              ?? Promise.resolve([])),
    (CycleTypesService.get?.()             ?? CycleTypesService.getAll?.()              ?? Promise.resolve([])),
    (CourseEnrollmentsService.get?.()      ?? CourseEnrollmentsService.getAll?.()       ?? Promise.resolve([]))
  ]);

  // 2) filtro relaciones por empleado logueado
  const myLinks = (linksAll || []).filter(l =>
    (l.employeeID ?? l.employeeId ?? l.employee) === teacherId
  );
  if (!myLinks.length) return [];

  // 3) índices por id
  const offeringsById = byId(offeringsAll, 'courseOfferingID', 'courseOfferingId');
  const subjectsById  = byId(subjectsAll,  'subjectDefinitionID', 'subjectDefinitionId');
  const ycsById       = byId(yearCyclesAll,'yearCycleID', 'yearCycleId');
  const ctsById       = byId(cycleTypesAll,'cycleTypeID', 'cycleTypeId');

  // 4) conteo de inscripciones por oferta
  const enrollCount = new Map();
  for (const e of enrollmentsAll || []) {
    const offId = e.courseOfferingID ?? e.courseOfferingId ?? e.offeringId;
    if (!offId) continue;
    enrollCount.set(offId, (enrollCount.get(offId) || 0) + 1);
  }

  // 5) compongo filas para la UI
  const rows = [];
  for (const link of myLinks) {
    const offId = link.courseOfferingID ?? link.courseOfferingId ?? link.offeringId;
    const off   = offeringsById.get(offId);
    if (!off) continue;

    const subj = subjectsById.get(off.subjectDefinitionID ?? off.subjectDefinitionId);
    const yc   = ycsById.get(off.yearCycleID ?? off.yearCycleId);
    const ct   = yc ? ctsById.get(yc.cycleTypeID ?? yc.cycleTypeId) : null;

    rows.push({
      id: offId,
      subjectName: subj?.name ?? subj?.subjectDefinitionName ?? off.subject ?? '—',
      group: off.group ?? off.groupCode ?? off.section ?? '—',
      cycle: buildCycleLabel(yc, ct),
      classroom: off.classroom ?? '—',
      schedule:  off.scheduleDescription ?? '—',  // si no manejas horarios separados
      studentCount: enrollCount.get(offId) || 0
    });
  }

  return rows;
}

async function loadStudentsForOffering(offeringId) {
  // bajo TODO y filtro
  const [enrollmentsAll, studentsAll, peopleAll] = await Promise.all([
    (CourseEnrollmentsService.get?.() ?? CourseEnrollmentsService.getAll?.() ?? Promise.resolve([])),
    (StudentsService.get?.()          ?? StudentsService.getAll?.()          ?? Promise.resolve([])),
    (PeopleService.get?.()            ?? PeopleService.getAll?.()            ?? Promise.resolve([]))
  ]);

  const myEnrolls = (enrollmentsAll || []).filter(e =>
    (e.courseOfferingID ?? e.courseOfferingId ?? e.offeringId) === offeringId
  );

  const studentIds = new Set(myEnrolls.map(e => e.studentID ?? e.studentId));
  const students   = (studentsAll || []).filter(s => studentIds.has(s.id ?? s.studentID ?? s.studentId));

  const peopleById = byId(peopleAll, 'personID', 'personId');

  return students.map(s => {
    const personId = s.personID ?? s.personId;
    const p = peopleById.get(personId);
    const fullName = p ? `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim()
                       : (s.fullName ?? s.name ?? '—');
    return { studentID: s.id ?? s.studentID ?? s.studentId, fullName };
  });
}

/* ------------------------------ Render UI ------------------------------- */
function renderRows(courses) {
  if (!courses.length) {
    tbody.innerHTML = `
      <tr>
        <td class="px-5 py-6 text-center text-[rgb(var(--text-from))]" colspan="${HEADERS.length}">
          Sin cursos asignados
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = courses.map(c => {
    const row = mapRow(c);
    return `
      <tr class="group hover:bg-gradient-to-r hover:from-[rgb(var(--button-from))] hover:to-[rgb(var(--button-to))] transition-colors duration-150">
        <td class="px-5 py-4 text-[rgb(var(--button-from))] group-hover:text-[rgb(var(--card-from))] drop-shadow-xl">${row.subject}</td>
        <td class="px-5 py-4 text-[rgb(var(--button-from))] group-hover:text-[rgb(var(--card-from))] drop-shadow-xl">${row.group}</td>
        <td class="px-5 py-4 text-[rgb(var(--button-from))] group-hover:text-[rgb(var(--card-from))] drop-shadow-xl">${row.cycle}</td>
        <td class="px-5 py-4">
          <button class="px-4 py-1.5 rounded-lg bg-gradient-to-tr from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] text-white shadow-md hover:brightness-110 hover:scale-[1.02] transition-all"
                  data-action="open-course"
                  data-id="${row.id}"
                  data-classroom="${row.classroom}"
                  data-schedule="${row.schedule}">
            Ver (${row.studentCount})
          </button>
        </td>
      </tr>
    `;
  }).join("");

  tbody.querySelectorAll('[data-action="open-course"]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const classroom = e.currentTarget.getAttribute('data-classroom') ?? '—';
      const schedule  = e.currentTarget.getAttribute('data-schedule') ?? '—';

      const tr = e.currentTarget.closest('tr');
      const subject = tr.children[0].textContent.trim();
      const group   = tr.children[1].textContent.trim();
      const cycle   = tr.children[2].textContent.trim();

      await openCourseDetail({ id, subject, group, cycle, classroom, schedule });
    });
  });
}

async function openCourseDetail(info) {
  try {
    const students = await loadStudentsForOffering(info.id);

    const tpl = document.querySelector('#tmpl-course-detail').content.cloneNode(true);
    tpl.querySelector('#cd-classroom').textContent = info.classroom;
    tpl.querySelector('#cd-schedule').textContent  = info.schedule;
    tpl.querySelector('#cd-group').textContent     = info.group;
    tpl.querySelector('#cd-cycle').textContent     = info.cycle;

    const list = tpl.querySelector('#cd-students');
    list.innerHTML = students.length
      ? students.map((s, i) => mapStudentRow(s, i)).join('')
      : `<tr><td class="px-5 py-4 text-[rgb(var(--text-from))]" colspan="2">Sin estudiantes</td></tr>`;

    const wrapper = document.createElement('div');
    wrapper.className = 'w-[92vw] max-w-2xl';
    wrapper.appendChild(tpl);
    Modal.show(wrapper);

    const onEsc = (ev) => { if (ev.key === 'Escape') { Modal.hide(); window.removeEventListener('keydown', onEsc); } };
    window.addEventListener('keydown', onEsc, { once: true });
  } catch (err) {
    console.error('[Course detail] error:', err);
    Toast.show('No se pudo cargar el detalle del curso.', 'error');
  }
}

/* --------------------------------- Boot -------------------------------- */
async function loadCourses() {
  try {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    console.log('[courses.controller] user en sesión:', user);

    const teacherId =
      user?.employeeID ?? user?.EmployeeID ?? user?.userID ?? user?.personID ?? user?.id;

    console.log('[courses.controller] teacherId:', teacherId);

    if (!teacherId) {
      Toast.show('No se encontró el ID del docente en la sesión.', 'warn');
      renderRows([]);
      return;
    }

    const data = await loadCoursesForTeacher(teacherId);
    console.log('[courses.controller] cursos:', data);
    renderRows(data);
  } catch (e) {
    console.error('[Courses] load error:', e);
    Toast.show('No se pudieron cargar tus cursos.', 'error');
    renderRows([]);
  }
}

async function boot() {
  try {
    // Pintar encabezado cuando el DOM ya existe
    if (thead) {
      thead.innerHTML = `
        <tr class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] drop-shadow-sm">
          ${HEADERS.map(h => `<th class="px-5 py-4 text-left select-none text-white drop-shadow-sm">${h}</th>`).join("")}
        </tr>
      `;
    } else {
      console.warn('[courses.controller] #thead no existe en el DOM');
    }

    await loadCourses();
  } catch (e) {
    console.error('[Boot] error:', e);
    Toast.show('No se pudo iniciar la vista.', 'error');
  }
}

// auto-init (siempre después de que el DOM esté listo)
if (document.readyState !== 'loading') {
  boot().catch(console.error);
} else {
  document.addEventListener('DOMContentLoaded', () => boot().catch(console.error));
}
