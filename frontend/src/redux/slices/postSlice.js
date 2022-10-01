import postApi from "@/api/postApi";
import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// redirect action
const resetCreateAction = createAction("post/create-reset");
const resetUpdateAction = createAction("post/update-reset");
const resetDeleteAction = createAction("post/delete-reset");

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

// Fetch all action
export const fetchAllPostAction = createAsyncThunk(
  "post/fetchAll",
  async (category, { rejectWithValue, getState, dispatch }) => {
    try {
      const posts = await postApi.fetchAll(category);
      return posts;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch one action
export const fetchOnePostAction = createAsyncThunk(
  "post/fetchOne",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const post = await postApi.fetchOne(id);
      return post;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Toggle likes to post
export const toggleAddLikesToPost = createAsyncThunk(
  "post/like",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const post = await postApi.toggleLike({
        postId: id,
      });
      return post;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Toggle disLikes to post
export const toggleAddDisLikesToPost = createAsyncThunk(
  "post/dislikes",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const post = await postApi.toggleDisLike({
        postId: id,
      });
      return post;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Update post action
export const updatePostAction = createAsyncThunk(
  "post/update",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const post = await postApi.update(data?.id, data?.params);
      // Dispatch action to remove updated data
      dispatch(resetUpdateAction());
      return post;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Delete post action
export const deletePostAction = createAsyncThunk(
  "post/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const post = await postApi.delete(id);
      // Dispatch action to remove deleted data
      dispatch(resetDeleteAction());
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
    // Create
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

    // Fetch all
    [fetchAllPostAction.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchAllPostAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.postList = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [fetchAllPostAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Fetch one
    [fetchOnePostAction.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchOnePostAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.post = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [fetchOnePostAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Toggle Likes
    [toggleAddLikesToPost.pending]: (state, action) => {
      state.loading = true;
    },
    [toggleAddLikesToPost.fulfilled]: (state, action) => {
      state.loading = false;
      state.likes = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [toggleAddLikesToPost.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Toggle disLikes
    [toggleAddDisLikesToPost.pending]: (state, action) => {
      state.loading = true;
    },
    [toggleAddDisLikesToPost.fulfilled]: (state, action) => {
      state.loading = false;
      state.disLikes = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [toggleAddDisLikesToPost.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Update
    [updatePostAction.pending]: (state, action) => {
      state.loading = true;
    },
    [resetUpdateAction]: (state, action) => {
      state.isEdited = true;
    },
    [updatePostAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.isEdited = false;
      state.postUpdated = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [updatePostAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Delete
    [deletePostAction.pending]: (state, action) => {
      state.loading = true;
    },
    [resetDeleteAction]: (state, action) => {
      state.isDeleted = true;
    },
    [deletePostAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.isDeleted = false;
      state.postUpdated = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [deletePostAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },
  },
});

export const {} = postSlice.actions;
export default postSlice.reducer;
