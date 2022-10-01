import commentApi from "@/api/commentApi";
import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// action to redirect
const resetCommentAction = createAction("comment/reset");

// create comment action
export const createCommentAction = createAsyncThunk(
  "/comment/create",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const comment = await commentApi.create(data);
      return comment;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Delete comment action
export const deleteCommentAction = createAsyncThunk(
  "/comment/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const comment = await commentApi.delete(id);
      return comment;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Update comment action
export const updateCommentAction = createAsyncThunk(
  "/comment/update",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const comment = await commentApi.update(data?.id, {
        description: data?.params?.description,
      });
      // dispatch to remove updated comment data
      dispatch(resetCommentAction);
      return comment;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch a single comment
export const fetchOneCommentAction = createAsyncThunk(
  "/comment/fetchOne",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const comment = await commentApi.fetchOne(id);
      return comment;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

const initialState = {
  comment: {},
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: {
    // Create
    [createCommentAction.pending]: (state, action) => {
      state.loading = true;
    },
    [createCommentAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.commentCreated = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [createCommentAction.pending]: (state, action) => {
      state.loading = false;
      state.commentCreated = undefined;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Delete
    [deleteCommentAction.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteCommentAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.commentDeleted = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [deleteCommentAction.pending]: (state, action) => {
      state.loading = false;
      state.commentDeleted = undefined;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Update
    [updateCommentAction.pending]: (state, action) => {
      state.loading = true;
    },
    [resetCommentAction]: (state, action) => {
      state.isEdited = true;
    },
    [updateCommentAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.isEdited = false;
      state.commentUpdated = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [updateCommentAction.pending]: (state, action) => {
      state.loading = false;
      state.commentUpdated = undefined;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Fetch single comment
    [fetchOneCommentAction.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchOneCommentAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.comment = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [fetchOneCommentAction.pending]: (state, action) => {
      state.loading = false;
      state.comment = undefined;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },
  },
});

export const {} = commentSlice.actions;
export default commentSlice.reducer;
