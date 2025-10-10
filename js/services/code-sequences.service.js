export const CodeSequencesService = {
    async list() {
        return [
            { sequenceID: 1, allocationID: 1, patternID: 4, lastNumber: 503, resetPolicy: "none" },
            { sequenceID: 2, allocationID: 2, patternID: 5, lastNumber: 704, resetPolicy: "none" },
            { sequenceID: 3, allocationID: 3, patternID: 1, lastNumber: 513, resetPolicy: "none" },
            { sequenceID: 4, allocationID: 4, patternID: 8, lastNumber: 552, resetPolicy: "none" },
            { sequenceID: 5, allocationID: 5, patternID: 2, lastNumber: 523, resetPolicy: "none" },
            { sequenceID: 6, allocationID: 6, patternID: 6, lastNumber: 546, resetPolicy: "none" },
            { sequenceID: 7, allocationID: 7, patternID: 9, lastNumber: 562, resetPolicy: "none" },
            { sequenceID: 8, allocationID: 8, patternID: 5, lastNumber: 582, resetPolicy: "none" },
            { sequenceID: 9, allocationID: 9, patternID: 10, lastNumber: 602, resetPolicy: "none" },
            { sequenceID: 10, allocationID: 10, patternID: 3, lastNumber: 633, resetPolicy: "yearly" }
        ];
    }
}