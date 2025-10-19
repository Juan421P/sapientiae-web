export class DataOperations {

    static join(tables, options = {}) {
        const { type = 'inner', filters = [] } = options;

        if (!Array.isArray(tables) || tables.length < 2)
            throw new Error('At least two tables are required for join()');

        let result = tables[0].data.map(row => this._prefixFields(row, tables[0].alias));

        for (let i = 1; i < tables.length; i++) {
            const leftTable = tables[i - 1];
            const rightTable = tables[i];
            const leftKey = leftTable.foreignKey || rightTable.key;
            const rightKey = rightTable.key;

            result = result.flatMap(rowA => {
                const leftAlias = leftTable.alias ? leftTable.alias + '_' : '';
                const leftValue = rowA[leftAlias + leftKey] ?? rowA[leftKey];
                const matches = rightTable.data.filter(rowB => leftValue === rowB[rightKey]);
                if (matches.length === 0 && type === 'left') return [rowA];
                return matches.map(rowB => ({
                    ...rowA,
                    ...this._prefixFields(rowB, rightTable.alias)
                }));
            });
        }

        return this._applyFilters(result, filters);
    }

    static getById(data, idField, idValue) {
        return data.find(item => item[idField] === idValue) || null;
    }

    static filter(data, filters = []) {
        return this._applyFilters(data, filters);
    }

    static count(data, filters = []) {
        return this._applyFilters(data, filters).length;
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

    static groupBy(data, key) {
        return data.reduce((acc, item) => {
            const k = item[key];
            if (!acc[k]) acc[k] = [];
            acc[k].push(item);
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

    static _applyFilters(data, filters = []) {
        if (!filters.length) return data;
        return data.filter(entry =>
            filters.every(filter => {
                const { field, operator, value } = filter;
                const entryValue = entry[field];
                switch (operator) {
                    case '>': return entryValue > value;
                    case '<': return entryValue < value;
                    case '>=': return entryValue >= value;
                    case '<=': return entryValue <= value;
                    case '==':
                    case '===': return entryValue === value;
                    case '!=':
                    case '!==': return entryValue !== value;
                    default: return true;
                }
            })
        );
    }

    static _prefixFields(row, alias) {
        if (!alias) return { ...row };
        const prefixed = {};
        for (const key in row) {
            prefixed[`${alias}_${key}`] = row[key];
        }
        return prefixed;
    }
    
}