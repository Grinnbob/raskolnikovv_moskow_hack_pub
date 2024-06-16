import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { DEFAULT_NAV_LINKS } from '@web/shared/const/config';
import { ModalState } from '@web/widgets/ReduxModal/lib/types';

export const initialState: {
  navLinks: Array<(typeof DEFAULT_NAV_LINKS)[number]>;
  searchFilters: boolean;
  modal: ModalState | null;
} = {
  navLinks: DEFAULT_NAV_LINKS,
  searchFilters: false,
  modal: null,
};

const GeneralSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setNavLinks(state, action: PayloadAction<typeof DEFAULT_NAV_LINKS>) {
      state.navLinks = action.payload;
    },
    toggleSearchFilters(state) {
      state.searchFilters = !state.searchFilters;
    },
    setModalState(state, action: PayloadAction<ModalState | null>) {
      state.modal = action.payload;
    },
  },
});

export const { setNavLinks, toggleSearchFilters, setModalState } =
  GeneralSlice.actions;

export const selectGenerals = (state: RootState) => state.general;
export const selectNavLinks = (state: RootState) => state.general.navLinks;
export const selectModal = (state: RootState) => state.general.modal;
export const isSearchFiltersOpen = (state: RootState) =>
  state.general.searchFilters;

export default GeneralSlice.reducer;
