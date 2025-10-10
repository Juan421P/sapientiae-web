export const AuditService = {
    async recent(userID, limit = 20) {
        return Array.from({ length: limit }).map((_, i) => ({
            operationAt: new Date(Date.now() - i * 1000 * 60 * 10).toISOString(),
            operationType: ['UPDATE', 'INSERT', 'DELETE'][i % 3],
            affectedTable: ['students', 'employees', 'faculties', 'roles'][i % 4],
            recordID: 1000 + i
        }));
    }
};