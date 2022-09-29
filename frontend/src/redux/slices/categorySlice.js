import categoryApi from "@/api/categoryApi";
import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Action to redirect
const resetEditAction = createAction("category/reset");
const resetDeleteAction = createAction("category/delete-reset");
const resetCreateAction = createAction("category/create-reset");

// Create action
export const createCategoryAction = createAsyncThunk(
  "category/create",
  async (category, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await categoryApi.create(category);
      // dispatch action to remove created category data
      dispatch(resetCreateAction());
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch all action
export const fetchAllCategoryAction = createAsyncThunk(
  "category/fetchAll",
  // async func must have pass value even don't use it (in this case: payload)
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await categoryApi.fetchAll();
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch one action
export const fetchOneCategoryAction = createAsyncThunk(
  "category/fetchOne",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await categoryApi.fetchOne(id);
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Update action
export const updateCategoryAction = createAsyncThunk(
  "category/update",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await categoryApi.update(data?.id, {
        title: data?.params?.title,
      });
      // dispatch action to reset the updated data
      dispatch(resetEditAction());
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Delete action
export const deleteCategoryAction = createAsyncThunk(
  "category/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await categoryApi.delete(id);
      // dispatch action to reset the deleted data
      dispatch(resetDeleteAction());
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

const initialState = {
  category: "NODE JS",
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: {
    // Create
    [createCategoryAction.pending]: (state, action) => {
      state.loading = true;
    },
    [resetCreateAction]: (state, action) => {
      state.isCreated = true;
    },
    [createCategoryAction.fulfilled]: (state, action) => {
      state.category = action?.payload;
      state.loading = false;
      state.isCreated = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [createCategoryAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Fetch all
    [fetchAllCategoryAction.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchAllCategoryAction.fulfilled]: (state, action) => {
      state.categoryList = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [fetchAllCategoryAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Fetch one
    [fetchOneCategoryAction.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchOneCategoryAction.fulfilled]: (state, action) => {
      state.category = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [fetchOneCategoryAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Update
    [updateCategoryAction.pending]: (state, action) => {
      state.loading = true;
    },
    // dispatch action to redirect
    [resetEditAction]: (state, action) => {
      state.isEdited = true;
    },
    [updateCategoryAction.fulfilled]: (state, action) => {
      state.updatedCategory = action?.payload;
      state.loading = false;
      state.isEdited = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [updateCategoryAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Delete
    [deleteCategoryAction.pending]: (state, action) => {
      state.loading = true;
    },
    // dispatch action to redirect
    [resetDeleteAction]: (state, action) => {
      state.isDeleted = true;
    },
    [deleteCategoryAction.fulfilled]: (state, action) => {
      state.deletedCategory = action?.payload;
      state.loading = false;
      state.isDeleted = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [deleteCategoryAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },
  },
});

export default categorySlice.reducer;
