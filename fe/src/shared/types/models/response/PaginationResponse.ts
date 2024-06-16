export interface Info {
  prevPage: number;
  nextPage: number;
  pagesTotal: number;
  resultsTotal: number;
}

export interface PaginatedResponse<T> {
  info: Info;
  results: T[];
}
