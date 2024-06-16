export interface SearchHistoryModel {
  id: number;
  searchText: string;
  searchType: SearchType;
  userId: number;
  frequency?: number;
  globalFrequency?: number;
}

export enum SearchType {
  RESUME = 'RESUME',
  VACANCY = 'VACANCY',
  COMPANY = 'COMPANY',
  POST = 'POST',
  OTHER = 'OTHER',
}
