// js/controllers/teacher-portal/courses.controller.js
import { CourseOfferingTeachersService } from "../../services/course-offering-teachers.service.js";
import { CourseOfferingsService }        from "../../services/course-offerings.service.js";
import { SubjectDefinitionsService }     from "../../services/subject-definitions.service.js";
import { YearCyclesService }             from "../../services/year-cycles.service.js";
import { CycleTypesService }             from "../../services/cycle-types.service.js";
import { CourseEnrollmentsService }      from "../../services/course-enrollments.service.js";
import { StudentsService }               from "../../services/students.service.js";
import { PeopleService }                 from "../../services/people.service.js";
import { Toast } from "../../../components/toast.js";
import { Modal } from "../../../components/modal.js";



// ===============================
// Tabla base (tu mismo estilo)
// ===============================
const thead = document.querySelector('#thead');
const tbody = document.querySelector('#tbody');
const HEADERS = ['Materia', 'Grupo', 'Ciclo académico', 'Estudiantes'];

thead.innerHTML = `
  <tr class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] drop-shadow-sm">
    ${HEADERS.map(h => `<th class="px-5 py-4 text-left select-none text-white drop-shadow-sm">${h}</th>`).join("")}
  </tr>
`;

// ===============================
// Helpers de mapeo/formatos
// ===============================
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

// ===============================
// Carga y composición usando SOLO services importados
// ===============================
async function loadCoursesForTeacher(teacherId) {
  // 1) relaciones docente-oferta
  const links = await CourseOfferingTeachersService.getByTeacher(teacherId);
  const offeringIds = [...new Set(links.map(x => x.courseOfferingID ?? x.courseOfferingId ?? x.offeringId))].filter(Boolean);
  if (!offeringIds.length) return [];

  // 2) ofertas
  const offerings = await CourseOfferingsService.getByIds(offeringIds);

  // 3) materias
  const subjectIds = [...new Set(offerings.map(o => o.subjectDefinitionID ?? o.subjectDefinitionId))].filter(Boolean);
  const subjects   = await SubjectDefinitionsService.getByIds(subjectIds);

  // 4) ciclos + tipo de ciclo
  const ycIds = [...new Set(offerings.map(o => o.yearCycleID ?? o.yearCycleId))].filter(Boolean);
  const ycs   = await YearCyclesService.getByIds(ycIds);
  const ctIds = [...new Set(ycs.map(y => y.cycleTypeID ?? y.cycleTypeId))].filter(Boolean);
  const cts   = await CycleTypesService.getByIds(ctIds);

  // 5) horarios (por oferta)
  const schedulesByOffering = {};
  await Promise.all(offeringIds.map(async id => {
    schedulesByOffering[id] = await CourseOfferingsService.getSchedules(id);
  }));

  // 6) conteo de inscripciones (por oferta)
  const enrollCountByOffering = {};
  await Promise.all(offeringIds.map(async id => {
    const enrolls = await CourseEnrollmentsService.getByOffering(id);
    enrollCountByOffering[id] = enrolls.length;
  }));

  // 7) armar DTO para la UI
  return offerings.map(o => {
    const offId = o.id ?? o.courseOfferingID ?? o.courseOfferingId ?? o.offeringId;
    const subj  = subjects.find(s => (s.id ?? s.subjectDefinitionID) === (o.subjectDefinitionID ?? o.subjectDefinitionId));
    const yc    = ycs.find(y => (y.id ?? y.yearCycleID) === (o.yearCycleID ?? o.yearCycleId));
    const ct    = cts.find(c => (c.id ?? c.cycleTypeID) === (yc?.cycleTypeID ?? yc?.cycleTypeId));

    const sch   = schedulesByOffering[offId] ?? [];
    const scheduleText = sch.length
      ? sch.map(s => `${s.dayName ?? s.day ?? ''} ${s.startTime ?? ''}-${s.endTime ?? ''}`.trim()).join(' · ')
      : (o.scheduleDescription ?? '—');

    return {
      id: offId,
      subjectName: subj?.name ?? subj?.subjectDefinitionName ?? '—',
      group: o.group ?? o.groupCode ?? o.section ?? '—',
      cycle: buildCycleLabel(yc, ct),
      classroom: o.classroom ?? '—',
      schedule: scheduleText,
      studentCount: enrollCountByOffering[offId] ?? 0
    };
  });
}

async function loadStudentsForOffering(offeringId) {
  const enrolls = await CourseEnrollmentsService.getByOffering(offeringId);
  const studentIds = [...new Set(enrolls.map(e => e.studentID ?? e.studentId))].filter(Boolean);
  if (!studentIds.length) return [];

  const students = await StudentsService.getByIds(studentIds);
  const personIds = [...new Set(students.map(s => s.personID ?? s.personId))].filter(Boolean);
  const people    = await PeopleService.getByIds(personIds);
  const peopleMap = new Map(people.map(p => [ (p.id ?? p.personID), p ]));

  return students.map(s => {
    const p = peopleMap.get(s.personID ?? s.personId);
    const fullName = p ? `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() : (s.fullName ?? s.name ?? '—');
    return { studentID: s.id ?? s.studentID ?? s.studentId, fullName };
  });
}

// ===============================
// Render tabla + modal
// ===============================
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
}

// ===============================
// Boot
// ===============================
async function loadCourses() {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const teacherId = user?.userID || user?.employeeID || user?.personID || user?.id;
  const data = await loadCoursesForTeacher(teacherId);
  renderRows(data);
}
await loadCourses();
