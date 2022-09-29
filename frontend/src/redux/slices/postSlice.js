import postApi from "@/api/postApi";
import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// redirect action
const resetCreateAction = createAction("post/create-reset");

// Create action
export const createPostAction = createAsyncThunk(
  "post/create",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("title", data?.title);
      formData.append("description", data?.description);
      formData.append("category", data?.category);
      formData.append("image", data?.image);

      const post = await postApi.create(formData);
      // Dispatch action to remove created data
      dispatch(resetCreateAction());
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
    [resetCreateAction]: (state, action) => {
      state.isCreated = true;
    },
    [createPostAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.isCreated = false;
      state.postCreated = action?.payload;
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
