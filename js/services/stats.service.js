import { fetchJSON } from "../lib/network";

const ENDPOINT = '/FIH7Wg/stats';

export const StatsService = {

    async summary(){
        const [summary] = await fetchJSON(ENDPOINT);
        return {
            students: summary.students,
            teachers: summary.teachers,
            courses: summary.courses,
            notices: summary.notices
        };
    },

    async adminSnapshot(){
        return {
            faculties: 4,
            departments: 12,
            careers: 25,
            students: 984,
            teachers: 58,
            courses: 134
        };
    }

};