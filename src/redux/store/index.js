import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../user";
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
