export const EntityTypesService = {
    async list() {
        return [
            { entityTypeID: 1, universityID: 1, entityType: "Personas" },
            { entityTypeID: 2, universityID: 1, entityType: "Usos administrativos" },
            { entityTypeID: 3, universityID: 1, entityType: "Carreras" },
            { entityTypeID: 4, universityID: 1, entityType: "Materias" },
            { entityTypeID: 5, universityID: 1, entityType: "Cursos especiales" },
            { entityTypeID: 6, universityID: 1, entityType: "Facultades" },
            { entityTypeID: 7, universityID: 1, entityType: "Departamentos" },
            { entityTypeID: 8, universityID: 1, entityType: "Laboratorios" },
            { entityTypeID: 9, universityID: 1, entityType: "Proyectos" },
            { entityTypeID: 10, universityID: 1, entityType: "Cursos regulares" }
        ];
    },
};