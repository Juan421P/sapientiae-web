export const ModalitiesService = {
    async list() {
        return Promise.resolve([
            {
                modalityID: 1,
                modalityName: 'Presencial'
            },
            {
                modalityID: 2,
                modalityName: 'Virtual'
            },
            {
                modalityID: 3,
                modalityName: 'Semipresencial'
            }
        ]);
    },

    async create(data) {
        console.log('Mock create modality:', data);
        return Promise.resolve({
            ...data,
            modalityID: Math.floor(Math.random() * 1000) + 4
        });
    }
};
