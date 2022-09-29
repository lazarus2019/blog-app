import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import postReducer from "./slices/postSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    category: categoryReducer,
    post: postReducer,
  },
});

export default store;
