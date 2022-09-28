import userApi from "@/api/userApi";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// register action
export const registerUserAction = createAsyncThunk(
  "users/register",
  async (user, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await userApi.register(user);
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

const initialState = {
  userAuth: "login",
};

const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: {
    [registerUserAction.pending]: (state, action) => {
      state.loading = true;
    },
    [registerUserAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.registered = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [registerUserAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },
  },
});

export const {} = usersSlice.actions;
export default usersSlice.reducer;
