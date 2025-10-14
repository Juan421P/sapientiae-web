export class DataOperations {

    static join(tables, options = {}) {
        const { type = 'inner', filters = [] } = options;

        if (!Array.isArray(tables) || tables.length < 2) {
            throw new Error('At least two tables are required for join()');
        }

        let result = tables[0].data;

        for (let i = 1; i < tables.length; i++) {
            const prev = tables[i - 1];
            const current = tables[i];
            const prevAlias = prev.alias || `t${i}`;
            const currentAlias = current.alias || `t${i + 1}`;

            result = result.flatMap(rowA => {
                const matches = current.data.filter(rowB =>
                    rowA[prev.foreignKey] === rowB[current.key]
                );

                if (matches.length === 0 && type === 'left') {
                    return [this._renameKeys(rowA, prevAlias)];
                }

                return matches.map(m => ({
                    ...this._renameKeys(rowA, prevAlias),
                    ...this._renameKeys(m, currentAlias)
                }));
            });
        }

        result = this._applyFilters(result, filters);
        return result;

    }

    static count(data, filters = []) {
        return this._applyFilters(data, filters).length;
    }

    static filter(data, filters = []) {
        return this._applyFilters(data, filters);
    }

    static groupBy(data, key) {
        return data.reduce((acc, item) => {
            const groupKey = item[key];
            if (!acc[groupKey]) acc[groupKey] = [];
            acc[groupKey].push(item);
            return acc;
        }, {});
    }

    static distinct(data, field) {
        const seen = new Set();
        return data.filter(item => {
            const val = item[field];
            if (seen.has(val)) return false;
            seen.add(val);
            return true;
        });
    }

    static sortBy(data, field, order = 'asc') {
        return [...data].sort((a, b) => {
            if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    static select(data, fields = []) {
        if (!fields.length) return data;
        return data.map(item => {
            const selected = {};
            fields.forEach(f => selected[f] = item[f]);
            return selected;
        });
    }

    static limit(data, count, offset = 0) {
        return data.slice(offset, offset + count);
    }

    static sum(data, field) {
        return data.reduce((acc, item) => acc + (parseFloat(item[field]) || 0), 0);
    }

    static avg(data, field) {
        return data.length ? this.sum(data, field) / data.length : 0;
    }

    static min(data, field) {
        return Math.min(...data.map(item => item[field]));
    }

    static max(data, field) {
        return Math.max(...data.map(item => item[field]));
    }

    static _applyFilters(data, filters = []) {
        if (!filters.length) return data;
        return data.filter(entry =>
            filters.every(filter => {
                const entryValue = entry[filter.field];
                const filterValue = filter.value;
                switch (filter.operator) {
                    case '>': return entryValue > filterValue;
                    case '<': return entryValue < filterValue;
                    case '>=': return entryValue >= filterValue;
                    case '<=': return entryValue <= filterValue;
                    case '==':
                    case '===': return entryValue === filterValue;
                    case '!=':
                    case '!==': return entryValue !== filterValue;
                    default: return true;
                }
            })
        );
    }

    static _renameKeys(obj, alias) {
        const renamed = {};
        for (const [k, v] of Object.entries(obj)) {
            renamed[`${alias}_${k}`] = v;
        }
        return renamed;
    }

}