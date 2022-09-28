import categoryApi from "@/api/categoryApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Create action
export const createCategoryAction = createAsyncThunk(
  "category/create",
  async (category, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await categoryApi.create(category);
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
    [createCategoryAction.pending]: (state, action) => {
      state.loading = true;
    },
    [createCategoryAction.fulfilled]: (state, action) => {
      state.category = action?.payload;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [createCategoryAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },
  },
});

export default categorySlice.reducer;
