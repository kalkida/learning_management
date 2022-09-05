import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { firebaseAuth, firestoreDb, app } from "../../firebase";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const phoneUser = createAsyncThunk("user/phoneUser", async (data) => {
  var resp = await JSON.stringify(data.user);
  const docRef = await doc(firestoreDb, "users", data.user.uid);
  const docSnap = await getDoc(docRef);
  const profile = await docSnap.data();
  // const profile = await JSON.stringify(pro);
  var data = { resp, profile };
  return data;
});

const loginUser = createAsyncThunk("user/loginUser", async (data) => {
  const response = await signInWithEmailAndPassword(
    firebaseAuth,
    data.email,
    data.password
  );
  var resp = await JSON.stringify(response);

  const docRef = await doc(firestoreDb, "users", response.user.uid);
  const docSnap = await getDoc(docRef);
  const profile = await docSnap.data();
  var data = { resp, profile };
  return data;
});

// const userRoles = createAsyncThunk("user/userRoles", async (data) => {
//   const docRef = await doc(firestoreDb, "users", data);
//   const docSnap = await getDoc(docRef);
//   const profile = await docSnap.data();
//   return profile.role;
// });

const userSlice = createSlice({
  name: "user",

  initialState: {
    loading: false,
    error: false,
    value: null,
    profile: null,
    role: "",
  },
  reducers: {
    logout: (state) => {
      signOut(firebaseAuth)
        .then(() => {
          state.value = null;
          state.error = false;
          state.loading = false;
        })
        .catch((error) => {
          state.value = null;
          state.error = true;
          state.loading = false;
        });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.value = action.payload.resp;
      state.profile = action.payload.profile;
      state.error = "";
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.value = {};
      state.error = action.error.message;
    });
    builder.addCase(phoneLogin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(phoneLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.value = action.payload.resp;
      state.profile = action.payload.profile;
      state.error = "";
    });
    builder.addCase(phoneLogin.rejected, (state, action) => {
      state.loading = false;
      state.value = {};
      state.error = action.error.message;
    });
  },
});
export const userLogin = loginUser;
export const phoneLogin = phoneUser;
export const userAction = userSlice.actions;
export default userSlice.reducer;
