export const CodePatternsService = {
    async list() {
        return [
            {
                patternID: 1,
                entityTypeID: 4,
                patternTemplate: "{PREFIX}{NUM:3}",
                regexValidation: "^[A-Z]{3}\\d{3}$",
                detail: "Prefijo 3 letras + 3 dígitos (materias)"
            },
            { 
                patternID: 2,
                entityTypeID: 3,
                patternTemplate: "{PREFIX:5}{NUM:3}",
                regexValidation: "^[A-Z]{5}\\d{3}$",
                detail: "Prefijo 5 letras + 3 dígitos (carreras)"
            },
            { patternID: 3, entityTypeID: 1, patternTemplate: "{I}{J}{YY}{SEQ:3}", regexValidation: "^[A-Z]{2}\\d{5}$", detail: "Iniciales + año(2) + secuencia(3) (personas)" },
            { patternID: 4, entityTypeID: 4, patternTemplate: "{PREFIX}-{NUM:3}", regexValidation: "^[A-Z]{3}-\\d{3}$", detail: "Formato alterno con guion" },
            { patternID: 5, entityTypeID: 5, patternTemplate: "{PREFIX}{NUM:4}", regexValidation: "^[A-Z]{3}\\d{4}$", detail: "Prefijo 3 letras + 4 dígitos (cursos especiales)" },
            { patternID: 6, entityTypeID: 2, patternTemplate: "{PREFIX}{NUM:2}", regexValidation: "^[A-Z]{2}\\d{2}$", detail: "Código corto (varios usos administrativos)" },
            { patternID: 7, entityTypeID: 7, patternTemplate: "{YY}{PREFIX}{SEQ:3}", regexValidation: "^\\d{2}[A-Z]{3}\\d{3}$", detail: "Año(2) + prefijo(3) + secuencia(3)" },
            { patternID: 8, entityTypeID: 8, patternTemplate: "{PREFIX}{NUM:3}{SUF}", regexValidation: "^[A-Z]{3}\\d{3}[A-Z]{1}$", detail: "Con sufijo de 1 letra" },
            { patternID: 9, entityTypeID: 9, patternTemplate: "{PREFIX}{NUM:3}", regexValidation: "^[A-Z]{3}\\d{3}$", detail: "Formato genérico 3+3" },
            { patternID: 10, entityTypeID: 10, patternTemplate: "{I}{J}{SEQ:4}", regexValidation: "^[A-Z]{2}\\d{4}$", detail: "Iniciales + secuencia de 4 dígitos" }
        ];
    }
}