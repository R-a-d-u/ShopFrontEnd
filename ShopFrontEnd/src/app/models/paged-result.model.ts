// models/paged-result.model.ts
export interface PagedResult<T> {
    items: T[];
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }