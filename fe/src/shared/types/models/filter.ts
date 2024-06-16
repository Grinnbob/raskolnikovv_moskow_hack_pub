import { Values } from '@web/shared/lib/getUpdatedQueryUrl';
import { SearchType } from './searchHistory';

export interface FilterModel {
  id: number;
  query: Record<string, Values>;
  searchType: SearchType;
  userId?: number;
  title?: string;
  frequency?: number;
  isSubscriptionActive?: boolean;
  subscriptionSource?: string;
}
