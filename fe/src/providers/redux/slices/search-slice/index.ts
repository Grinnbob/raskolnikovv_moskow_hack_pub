import {
  createSlice,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { SearchHistoryModel } from '@web/shared/types/models/searchHistory';
import { fetchSearchVacancyHistories } from './asyncActions';

const initialState = {
  vacancyHistories: {
    loading: false,
    data: null as SearchHistoryModel[] | null,
    error: '',
  },
  savedFilters: {
    loading: false,
    data: null as File[] | null,
    error: '',
  },
};

const SearchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    injectVacancyHistories(
      state,
      action: PayloadAction<SearchHistoryModel[] | null>,
    ) {
      state.vacancyHistories.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchVacancyHistories.fulfilled, (state, action) => {
        state.vacancyHistories.data = action.payload;
        state.vacancyHistories.loading = false;
        state.vacancyHistories.error = '';
      })
      .addMatcher(isPending(fetchSearchVacancyHistories), (state) => {
        state.vacancyHistories.loading = true;
        state.vacancyHistories.error = '';
      })
      .addMatcher(isRejected(fetchSearchVacancyHistories), (state) => {
        state.vacancyHistories.loading = false;
        state.vacancyHistories.error = 'Error in SearchSlice';
      });
  },
});

export const selectSearchVacancyHistories = (state: RootState) =>
  state.search.vacancyHistories;

export const { injectVacancyHistories } = SearchSlice.actions;

export default SearchSlice.reducer;
