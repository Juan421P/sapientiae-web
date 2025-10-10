import { fetchJSON, postJSON, putJSON } from './../lib/network.js';
import { CourseOfferingSchedulesContract } from './../contracts/course-offering-schedules.contract.js';

const ENDPOINT = '/courseOfferingSchedules';

export const CourseOfferingSchedulesService = {
    contract: CourseOfferingSchedulesContract,

    async list() {
        const courseOfferingSchedules = await fetchJSON(
            `${ENDPOINT}/GetAllCourseOfferingSchedules`
        );
        const parsed = Array.isArray(courseOfferingSchedules) ? courseOfferingSchedules.map(n => CourseOfferingSchedulesContract.parse(n, 'table')) : [];
        document.dispatchEvent(new CustomEvent('CourseOfferingSchedules:list', {
            detail: parsed
        }));
        return parsed;
    },

    async create(data) {
        const courseOfferingSchedules = await postJSON(
            `${ENDPOINT}/AddCourseOfferingSchedule`,
            CourseOfferingSchedulesContract.parse(data, 'create')
        );
        const parsed = CourseOfferingSchedulesContract.parse(courseOfferingSchedules, 'table');
        document.dispatchEvent(new CustomEvent('CourseOfferingSchedules:create', {
            detail: parsed
        }));
        return parsed;
    },

    async update(data) {
        const courseOfferingSchedules = await putJSON(
            `${ENDPOINT}/UpdateCourseOfferingSchedule/${data.id}`,
            CourseOfferingSchedulesContract.parse(data, 'update')
        );
        const parsed = CourseOfferingSchedulesContract.parse(courseOfferingSchedules, 'table');
        document.dispatchEvent(new CustomEvent('CourseOfferingSchedules:update', { detail: parsed }));
        return parsed;
    },

    async delete(id) {
        const success = await deleteJSON(
            `${ENDPOINT}/DeleteCourseOfferingSchedule/${id}`
        );
        document.dispatchEvent(new CustomEvent('CourseOfferingSchedules:delete', {
            detail: {
                id,
                success
            }
        }));
        return success === true;
    }
};