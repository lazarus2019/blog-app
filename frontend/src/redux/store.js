import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    category: categoryReducer
  },
});

export default store;
