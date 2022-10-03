import mailApi from "@/api/mailApi";
import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// action to redirect
const resetEmailAction = createAction("mail/sent-reset");

// Send mail action
export const sendMailAction = createAsyncThunk(
  "mail/sent",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const mail = await mailApi.sendMail(data);
      dispatch(resetEmailAction());
      return mail;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

const initialState = {};

const mailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {},
  extraReducers: {
    [sendMailAction.pending]: (state, action) => {
      state.loading = true;
    },
    [resetEmailAction]: (state, action) => {
      state.isSent = true;
    },
    [sendMailAction.fulfilled]: (state, action) => {
      state.mailSent = action?.payload;
      state.loading = false;
      state.isSent = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [sendMailAction.rejected]: (state, action) => {
      state.mailSent = undefined;
      state.loading = false;
      state.appErr = action?.payload;
      state.serverErr = action?.payload?.message;
    },
  },
});

export const {} = mailSlice.actions;
export default mailSlice.reducer;
