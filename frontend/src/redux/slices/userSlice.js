import userApi from "@/api/userApi";
import verifyApi from "@/api/verifyApi";
import storageKeys from "@/constants";
import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";

// redirect action
const resetUpdateProfileAction = createAction("/user/reset-update");
const resetPasswordAction = createAction("/user/reset-password");

// register action
export const registerUserAction = createAsyncThunk(
  "/user/register",
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
  "/user/login",
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

// Logout action
export const logoutAction = createAsyncThunk(
  "/user/logout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      localStorage.removeItem(storageKeys.USER);
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Profile
export const userProfileAction = createAsyncThunk(
  "/user/profile",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const userProfile = await userApi.profile(id);
      return userProfile;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// upload profile photo action
export const uploadProfilePhotoAction = createAsyncThunk(
  "/user/profilephoto-upload",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("photo", data?.image);
      const res = await userApi.uploadProfilePhoto(formData);
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Update profile action
export const updateProfileAction = createAsyncThunk(
  "/user/update",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await userApi.update(data);
      // dispatch reset action for remove updated data
      dispatch(resetUpdateProfileAction());
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Following action
export const followUserAction = createAsyncThunk(
  "/user/follow",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await userApi.follow({ followId: id });
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// UnFollowing action
export const unFollowUserAction = createAsyncThunk(
  "/user/unFollow",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await userApi.unFollow({ unFollowId: id });
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// [ADMIN]Fetch all users
export const fetchAllUsersAction = createAsyncThunk(
  "/user/list",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await userApi.getList();
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// [ADMIN]Block user
export const blockUserAction = createAsyncThunk(
  "/user/block",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await userApi.block(id);
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// [ADMIN]Unblock user
export const unBlockUserAction = createAsyncThunk(
  "/user/unblock",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await userApi.unBlock(id);
      return res;
    } catch (error) {
      if (!error?.response) throw error;
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Update password
export const updatePasswordAction = createAsyncThunk(
  "user/password-update",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const res = await userApi.updatePassword(data);
      // dispatch for remove updated password data
      dispatch(resetPasswordAction());
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

    // Logout
    [logoutAction.pending]: (state, action) => {
      state.loading = false;
    },
    [logoutAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.userAuth = undefined;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [logoutAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Profile
    [userProfileAction.pending]: (state, action) => {
      state.loading = false;
    },
    [userProfileAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [userProfileAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // upload profile photo
    [uploadProfilePhotoAction.pending]: (state, action) => {
      state.loading = false;
    },
    [uploadProfilePhotoAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.photoUploaded = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [uploadProfilePhotoAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Update profile photo
    [updateProfileAction.pending]: (state, action) => {
      state.loading = false;
    },
    [resetUpdateProfileAction]: (state, action) => {
      state.isUpdated = true;
    },
    [updateProfileAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.userAuth = action?.payload;
      state.isUpdated = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [updateProfileAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // follow
    [followUserAction.pending]: (state, action) => {
      state.loading = false;
    },
    [followUserAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.followed = action?.payload;
      state.unFollowed = undefined;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [followUserAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // unFollow
    [unFollowUserAction.pending]: (state, action) => {
      state.loading = false;
    },
    [unFollowUserAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.unFollowed = action?.payload;
      state.followed = undefined;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [unFollowUserAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Get list users
    [fetchAllUsersAction.pending]: (state, action) => {
      state.loading = false;
    },
    [fetchAllUsersAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.userList = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [fetchAllUsersAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Block user
    [blockUserAction.pending]: (state, action) => {
      state.loading = false;
    },
    [blockUserAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.block = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [blockUserAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Get list users
    [unBlockUserAction.pending]: (state, action) => {
      state.loading = false;
    },
    [unBlockUserAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.unblock = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [unBlockUserAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },

    // Get list users
    [updatePasswordAction.pending]: (state, action) => {
      state.loading = false;
    },
    [resetPasswordAction]: (state, action) => {
      state.passwordUpdated = true;
    },
    [updatePasswordAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.passwordUpdated = false;
      state.newPasswordUser = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    },
    [updatePasswordAction.rejected]: (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    },
  },
});

export const {} = usersSlice.actions;
export default usersSlice.reducer;
