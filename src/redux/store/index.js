import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../user";
import classReducer from "../class";

const store = configureStore({
  reducer: {
    user: userReducer,
    class: classReducer,
  },
});

export default store;
