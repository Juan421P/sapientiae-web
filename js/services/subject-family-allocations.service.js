export const SubjectFamilyAllocationsService = {
    async list() {
        return [
            { allocationID: 1, subjectFamilyID: 1001, correlativeID: 202, startNumber: 501, endNumber: 503, allocatedAt: "2024-01-15T09:00:00Z" },
            { allocationID: 2, subjectFamilyID: 1002, correlativeID: 203, startNumber: 700, endNumber: 704, allocatedAt: "2024-02-10T10:30:00Z" },
            { allocationID: 3, subjectFamilyID: 1003, correlativeID: 202, startNumber: 510, endNumber: 513, allocatedAt: "2024-03-05T08:45:00Z" },
            { allocationID: 4, subjectFamilyID: 1004, correlativeID: 204, startNumber: 550, endNumber: 552, allocatedAt: "2024-04-20T14:00:00Z" },
            { allocationID: 5, subjectFamilyID: 1005, correlativeID: 205, startNumber: 520, endNumber: 523, allocatedAt: "2024-05-11T11:20:00Z" },
            { allocationID: 6, subjectFamilyID: 1006, correlativeID: 202, startNumber: 544, endNumber: 546, allocatedAt: "2024-06-01T16:00:00Z" },
            { allocationID: 7, subjectFamilyID: 1007, correlativeID: 203, startNumber: 560, endNumber: 562, allocatedAt: "2024-06-15T09:30:00Z" },
            { allocationID: 8, subjectFamilyID: 1008, correlativeID: 204, startNumber: 580, endNumber: 582, allocatedAt: "2024-07-01T12:00:00Z" },
            { allocationID: 9, subjectFamilyID: 1009, correlativeID: 205, startNumber: 600, endNumber: 602, allocatedAt: "2024-07-20T13:10:00Z" },
            { allocationID: 10, subjectFamilyID: 1010, correlativeID: 201, startNumber: 630, endNumber: 633, allocatedAt: "2024-08-05T15:45:00Z" }
        ];
    }
}