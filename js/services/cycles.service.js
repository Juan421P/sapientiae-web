export const CyclesService = {
    async list() {
        // Simulating an API call with mock data
        return Promise.resolve([
            {
                cycleTypeID: 1,
                cycleLabel: 'Ciclo I - 2025',
                startDate: '2025-01-10',
                endDate: '2025-06-15'
            },
            {
                cycleTypeID: 2,
                cycleLabel: 'Ciclo II - 2025',
                startDate: '2025-07-01',
                endDate: '2025-12-10'
            }
        ]);
    },

    async create(data) {
        console.log('Mock create cycle:', data);
        // Simulate creating a cycle and returning it with a fake ID
        return Promise.resolve({
            ...data,
            cycleTypeID: Math.floor(Math.random() * 1000) + 3
        });
    }
};
