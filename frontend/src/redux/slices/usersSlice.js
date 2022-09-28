import userApi from "@/api/userApi";
import storageKeys from "@/constants";
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

// login action
export const loginUserAction = createAsyncThunk(
  "users/login",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await userApi.login(userData);
      localStorage.setItem(storageKeys.USER, JSON.stringify(res));
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Get user from local storage and place into store
const userLoginFromLocalStorage = localStorage.getItem(storageKeys.USER)
  ? JSON.parse(localStorage.getItem(storageKeys.USER))
  : null;

const initialState = {
  userAuth: userLoginFromLocalStorage,
};

const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: {
    // Register
    [registerUserAction.pending]: (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
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

    // Login
    [loginUserAction.pending]: (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [loginUserAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.userAuth = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [loginUserAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },
  },
});

export const {} = usersSlice.actions;
export default usersSlice.reducer;
