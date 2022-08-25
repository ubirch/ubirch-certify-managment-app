import { SortDirection } from '@angular/material/sort';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

const FILTER_PARAM_PREFIX = 'filterColumn';

export class Filters {
    search = '';
    sortColumn = '';
    from = '';
    to = '';
    sortOrder: SortDirection = 'asc';
    pageIndex = 0;
    pageSize: number = DEFAULT_PAGE_SIZE;
    filterColumns: FilterColumn;
}

export interface FilterColumn {
    [column: string]: string;
}

export const flattenFilters = (filters: Filters) => {
    const { filterColumns, ...other } = filters;
    if (!filterColumns) {
        return filters;
    }

    const flatFilters = Object.keys(filterColumns).reduce((acc, key) => {
        const newKey = `${FILTER_PARAM_PREFIX}[${key}]`;
        acc[newKey] = filters.filterColumns[key].toString();
        return acc;
    }, {});

    return { ...other, ...flatFilters };
};
