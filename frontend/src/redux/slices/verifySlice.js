import verifyApi from "@/api/verifyApi";
import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// action to redirect
const resetVerifyAccountAction = createAction("verify/account-verify-reset");

// Send verify token to email action
export const generateVerifyAccount = createAsyncThunk(
  "/verify/generate-token",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await verifyApi.generateVerifyAccount();
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Verify token action
export const verifyAccount = createAsyncThunk(
  "/verify/verify-token",
  async (token, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await verifyApi.verifyAccount({ token });
      // dispatch for remove token data
      dispatch(resetVerifyAccountAction());
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Send reset password verify token to email action
export const generateResetPassword = createAsyncThunk(
  "/verify/password-generate-token",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await verifyApi.generateForgetPassword(data);
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Verify reset password token action
export const verifyResetPassword = createAsyncThunk(
  "/verify/password-verify-token",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await verifyApi.verifyForgetPassword(data);
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

const initialState = {};

const verifySlice = createSlice({
  name: "verify",
  initialState,
  reducers: {},
  extraReducers: {
    // send verify token to user email
    [generateVerifyAccount.pending]: (state, action) => {
      state.loading = false;
    },
    [generateVerifyAccount.fulfilled]: (state, action) => {
      state.loading = false;
      state.verifyToken = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [generateVerifyAccount.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // verify token
    [verifyAccount.pending]: (state, action) => {
      state.loading = false;
    },
    [resetVerifyAccountAction]: (state, action) => {
      state.isVerified = true;
    },
    [verifyAccount.fulfilled]: (state, action) => {
      state.loading = false;
      state.verified = action?.payload;
      state.isVerified = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [verifyAccount.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // generate forget password token
    [generateResetPassword.pending]: (state, action) => {
      state.loading = false;
    },
    [generateResetPassword.fulfilled]: (state, action) => {
      state.loading = false;
      state.successMsg = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [generateResetPassword.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // verify forget password token
    [verifyResetPassword.pending]: (state, action) => {
      state.loading = false;
    },
    [verifyResetPassword.fulfilled]: (state, action) => {
      state.loading = false;
      state.passwordReset = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [verifyResetPassword.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },
  },
});

export const {} = verifySlice.actions;
export default verifySlice.reducer;
