import postApi from "@/api/postApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Create action
export const createPostAction = createAsyncThunk(
  "post/create",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const post = await postApi.create(data);
      return post;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

const initialState = {
  post: {},
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: {
    [createPostAction.pending]: (state, action) => {
      state.loading = true;
    },
    [createPostAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.post = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [createPostAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },
  },
});

export const {} = postSlice.actions;
export default postSlice.reducer;
