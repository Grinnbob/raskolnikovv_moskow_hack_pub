import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  BackendAPI,
  backendApiInstance,
} from '@web/shared/services/BackendAPI';
import { SearchType } from '@web/shared/types/models/searchHistory';
import { injectVacancyHistories, selectSearchVacancyHistories } from '.';
import { RootState } from '../../store';

export const fetchSearchVacancyHistories = createAsyncThunk(
  'search/fetchSearchVacancyHistories',
  async ({
    includeText,
    api = backendApiInstance,
  }: {
    includeText?: string;
    api: BackendAPI;
  }) => {
    return await api.getSearchHistoryRecommendations(
      SearchType.VACANCY,
      includeText,
    );
  },
);

export const deleteSearchVacancyHistories = createAsyncThunk(
  'search/deleteSearchVacancyHistories',
  async (
    { id, api = backendApiInstance }: { id: number; api: BackendAPI },
    thunkApi,
  ) => {
    const currentData = selectSearchVacancyHistories(
      thunkApi.getState() as RootState,
    );
    if (currentData.data) {
      const newHistories = currentData.data.filter(
        (history) => history.id !== id,
      );
      thunkApi.dispatch(injectVacancyHistories(newHistories));
    }
    api.deleteMySearchHistory(id).catch(() => {
      thunkApi.dispatch(injectVacancyHistories(currentData.data));
    });
  },
);
