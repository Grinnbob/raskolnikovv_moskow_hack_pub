import { createSlice, isPending, isRejected } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { IProduct } from '@web/shared/types/types';

const initialState = {
  isLoading: false,
  userItems: [] as IProduct[],
  error: null as string | null,
};

const UserItemSlice = createSlice({
  name: 'userItems',
  initialState,
  reducers: {},
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getUserItems.fulfilled, (state, action) => {
  //       state.userItems = action.payload;
  //       state.isLoading = false;
  //       state.error = null;
  //     })

  //     .addMatcher(isPending(getUserItems), (state) => {
  //       state.isLoading = true;
  //       state.error = null;
  //     })

  //     .addMatcher(isRejected(getUserItems), (state, action) => {
  //       state.isLoading = false;
  //       state.error = 'Error in userItemSlice';
  //     });
  // },
});

export const selectUserItems = (state: RootState) => state.userItems;

export default UserItemSlice.reducer;
