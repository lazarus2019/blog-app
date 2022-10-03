import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import postReducer from "./slices/postSlice";
import userReducer from "./slices/userSlice";
import commentReducer from "./slices/commentSlice";
import mailReducer from "./slices/mailSlice";
import verifyReducer from "./slices/verifySlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    category: categoryReducer,
    post: postReducer,
    comment: commentReducer,
    mail: mailReducer,
    verify: verifyReducer,
  },
});

export default store;
