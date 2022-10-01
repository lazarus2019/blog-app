import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import postReducer from "./slices/postSlice";
import userReducer from "./slices/userSlice";
import commentReducer from "./slices/commentSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    category: categoryReducer,
    post: postReducer,
    comment: commentReducer,
  },
});

export default store;
