import { StudentsService } from './../../services/students.service';
import { StudentCareerEnrollmentsService } from './../../services/student-career-enrollments.service';
import { CareersService } from './../../services/careers.service';
import { PensumService } from './../../services/pensa.service.js';
import { PensumSubjectsService } from './../../services/pensum-subjects.service';
import { SubjectDefinitionsService } from './../../services/subject-definitions.service';
import { RequirementConditionsService } from './../../services/requirement-conditions.service';
import { RequirementsService } from './../../services/requirements.service';

const s = await StudentsService.get();
const sce = await StudentCareerEnrollmentsService.get();
const c = await CareersService.get();
const p = await PensumService.get();
const ps = await PensumSubjectsService.get();
const sd = await SubjectDefinitionsService.get();
const rc = await RequirementConditionsService.get();
const r = await RequirementsService.get();

console.log(s);
console.log(sce);
console.log(c);
console.log(p);
console.log(ps);
console.log(sd);
console.log(rc);
console.log(r);