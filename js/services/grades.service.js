export const GradesService = {
    async list() {
        return Promise.resolve([
            { academicLevelID: 1, academicLevelName: 'Pregrado' },
            { academicLevelID: 2, academicLevelName: 'Posgrado' }
        ]);
    },

    async create(data) {
        console.log('[Mock Create Grade]', data);
        return Promise.resolve({ ...data, academicLevelID: Math.floor(Math.random() * 1000) });
    }
};
