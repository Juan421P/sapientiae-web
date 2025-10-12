/*
import { CoursesService } from "../../services/courses.service.js";
const { Modal } = await import("../../components/modal.js");

const thead = document.querySelector('#thead');
const tbody = document.querySelector('#tbody');

const HEADERS = ['Materia', 'Grupo', 'Ciclo académico', 'Estudiantes'];

thead.innerHTML = `
  <tr class="bg-gradient-to-r from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] drop-shadow-sm">
    ${HEADERS.map(h => `
      <th class="px-5 py-4 text-left select-none text-white drop-shadow-sm">${h}</th>
    `).join("")}
  </tr>
`;

// ——— helpers ———

// Mapea un objeto “course offering” a lo que la UI necesita.
// Cambia las llaves si tu DTO usa otros nombres.
function mapCourse(c) {
  return {
    id: c.id ?? c.courseOfferingID ?? c.courseId ?? c.offeringId,
    subject: c.subjectName ?? c.subject ?? c.materia ?? c.subjectDefinitionName ?? '—',
    group: c.group ?? c.groupCode ?? c.section ?? c.grupo ?? '—',
    cycle: c.cycle ?? c.yearCycleName ?? c.cycleName ?? '—',
    classroom: c.classroom ?? c.aula ?? '—',
    schedule: c.schedule ?? c.scheduleDescription ?? c.horario ?? '—',
    studentCount: (Array.isArray(c.students) ? c.students.length : (c.studentCount ?? c.countStudents ?? 0)),
    students: Array.isArray(c.students) ? c.students : null
  };
}

function mapStudent(s, i) {
  const full = s.fullName ?? s.name ?? `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim() || '—';
  return `
    <tr>
      <td class="px-5 py-3 text-[rgb(var(--button-from))]">${i + 1}</td>
      <td class="px-5 py-3 text-[rgb(var(--button-from))]">${full}</td>
    </tr>
  `;
}

// ——— render tabla ———

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
    const course = mapCourse(c);

    return `
      <tr class="group hover:bg-gradient-to-r hover:from-[rgb(var(--button-from))] hover:to-[rgb(var(--button-to))] transition-colors duration-150">
        <td class="px-5 py-4 text-[rgb(var(--button-from))] group-hover:text-[rgb(var(--card-from))] drop-shadow-xl">
          ${course.subject}
        </td>
        <td class="px-5 py-4 text-[rgb(var(--button-from))] group-hover:text-[rgb(var(--card-from))] drop-shadow-xl">
          ${course.group}
        </td>
        <td class="px-5 py-4 text-[rgb(var(--button-from))] group-hover:text-[rgb(var(--card-from))] drop-shadow-xl">
          ${course.cycle}
        </td>
        <td class="px-5 py-4">
          <button
            class="px-4 py-1.5 rounded-lg bg-gradient-to-tr from-[rgb(var(--button-from))] to-[rgb(var(--button-to))] text-white shadow-md hover:brightness-110 hover:scale-[1.02] transition-all"
            data-action="open-course" data-id="${course.id}">
            Ver (${course.studentCount})
          </button>
        </td>
      </tr>
    `;
  }).join("");

  // Delegación de evento para los botones "Ver (...)"
  tbody.querySelectorAll('[data-action="open-course"]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const original = courses.find(x =>
        (x.id ?? x.courseOfferingID ?? x.courseId ?? x.offeringId)?.toString() === id
      );

      await openCourseDetail(original);
    });
  });
}

// ——— modal detalle ———

async function openCourseDetail(rawCourse) {
  const course = mapCourse(rawCourse);

  // Si el curso no trae estudiantes embebidos, los pedimos
  let students = course.students;
  if (!students) {
    try {
      students = await CoursesService.getStudentsByCourse(course.id);
    } catch {
      students = [];
    }
  }

  // Modal
  const tpl = document.querySelector('#tmpl-course-detail').content.cloneNode(true);
  tpl.querySelector('#cd-classroom').textContent = course.classroom;
  tpl.querySelector('#cd-schedule').textContent = course.schedule;
  tpl.querySelector('#cd-group').textContent = course.group;
  tpl.querySelector('#cd-cycle').textContent = course.cycle;

  const list = tpl.querySelector('#cd-students');
  list.innerHTML = (students && students.length)
    ? students.map((s, i) => mapStudent(s, i)).join('')
    : `<tr><td class="px-5 py-4 text-[rgb(var(--text-from))]" colspan="2">Sin estudiantes</td></tr>`;

  const modal = new Modal({ size: 'md', content: tpl });
  await modal.open();
}

// ——— load ———

async function loadCourses() {
  // Sugerencia: en tu login ya guardan user en sessionStorage
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  // teacherId puede variar según tu payload (employeeID, userID, etc.)
  const teacherId = user?.userID || user?.employeeID || user?.personID;

  const data = await CoursesService.getByTeacher(teacherId);
  renderRows(Array.isArray(data) ? data : []);
}

await loadCourses();
*/