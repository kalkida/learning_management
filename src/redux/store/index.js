import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../user";
<<<<<<< HEAD
import classReducer from "../class";

const store = configureStore({
  reducer: {
    user: userReducer,
    class: classReducer,
=======
import studentReducer from "../student";
import coursesReducer, { listCourse } from "../courses";
import { persistStore, persistReducer } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "user",
  storage: window.localStorage,
};

const store = configureStore({
  reducer: {
    user: persistReducer(persistConfig, userReducer),
    student: studentReducer,
    courses: coursesReducer,
>>>>>>> f21e2e90a86c04d7b4945d94c7d403de4dfdfa89
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

store.dispatch(listCourse());
// export const persist = persistStore(store);

export default store;
