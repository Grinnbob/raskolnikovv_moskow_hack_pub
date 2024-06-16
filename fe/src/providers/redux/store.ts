import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import GeneralSliceReducer from './slices/general-slice';
import SearchSliceReducer from './slices/search-slice';

export const store = configureStore({
  reducer: {
    general: GeneralSliceReducer,
    search: SearchSliceReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefault) => {
    return getDefault({ serializableCheck: false });
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
