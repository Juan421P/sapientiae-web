export const CodeGenerationLogService = {
    async list() {
        return [
            { generationLogID: 1, entityTypeID: 4, patternID: 1, allocationID: 1, generatedFor: 5001, generatedBy: 9001, generatedCode: "MAT501", generatedAt: "2024-01-16T09:10:00Z" },
            { generationLogID: 2, entityTypeID: 5, patternID: 5, allocationID: 2, generatedFor: 5002, generatedBy: 9002, generatedCode: "INF700", generatedAt: "2024-02-11T10:35:00Z" },
            { generationLogID: 3, entityTypeID: 1, patternID: 3, allocationID: null, generatedFor: 5003, generatedBy: 9003, generatedCode: "JP25001", generatedAt: "2025-01-05T08:00:00Z" },
            { generationLogID: 4, entityTypeID: 4, patternID: 4, allocationID: 3, generatedFor: 5004, generatedBy: 9004, generatedCode: "MAT513", generatedAt: "2024-03-06T09:00:00Z" },
            { generationLogID: 5, entityTypeID: 3, patternID: 2, allocationID: 5, generatedFor: 5005, generatedBy: 9005, generatedCode: "SDVLP020", generatedAt: "2024-05-12T11:30:00Z" },
            { generationLogID: 6, entityTypeID: 8, patternID: 8, allocationID: 8, generatedFor: 5006, generatedBy: 9006, generatedCode: "LAB580A", generatedAt: "2024-07-02T12:10:00Z" },
            { generationLogID: 7, entityTypeID: 10, patternID: 10, allocationID: 9, generatedFor: 5007, generatedBy: 9007, generatedCode: "CRS602", generatedAt: "2024-07-21T13:20:00Z" },
            { generationLogID: 8, entityTypeID: 6, patternID: 6, allocationID: 6, generatedFor: 5008, generatedBy: 9008, generatedCode: "FAC546", generatedAt: "2024-06-02T16:05:00Z" },
            { generationLogID: 9, entityTypeID: 2, patternID: 6, allocationID: null, generatedFor: 5009, generatedBy: 9009, generatedCode: "EM047", generatedAt: "2025-02-10T14:25:00Z" },
            { generationLogID: 10, entityTypeID: 9, patternID: 9, allocationID: 10, generatedFor: 5010, generatedBy: 9010, generatedCode: "PRJ633", generatedAt: "2024-08-06T15:55:00Z" }
        ];
    }
}