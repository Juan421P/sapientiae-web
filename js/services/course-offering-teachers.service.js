import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { CourseOfferingTeachersContract } from './../contracts/course-offering-teachers.contract.js';

const ENDPOINT = '/CourseOfferingsTeachers';

export const CourseOfferingTeachersService = {
    contract: CourseOfferingTeachersContract,

    async list() {
        const courseOfferingTeachers = await fetchJSON(
            `${ENDPOINT}/getAllCourseOfferingsTeachers`
        );
        const parsed = Array.isArray(courseOfferingTeachers) ? courseOfferingTeachers.map(n => CourseOfferingTeachersContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('CourseOfferingTeachers:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const courseOfferingTeachers = await postJSON(
            `${ENDPOINT}/insertCourseOfferingTeacher`,
            CourseOfferingTeachersContract.parse(data, 'create')
        );
        const parsed = CourseOfferingTeachersContract.parse(courseOfferingTeachers, 'table');
        document.dispatchEvent(new CustomEvent('CourseOfferingTeachers:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const courseOfferingTeachers = await putJSON(
            `${ENDPOINT}/updateCourseOfferingTeacher/${data.courseOfferingTeacherID}`,
            CourseOfferingTeachersContract.parse(data, 'update')
        );
        const parsed = CourseOfferingTeachersContract.parse(courseOfferingTeachers, 'table');
        document.dispatchEvent(new CustomEvent('CourseOfferingTeachers:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/deleteCourseOfferingTeacher/${id}`
        );
        document.dispatchEvent(new CustomEvent('CourseOfferingTeachers:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};