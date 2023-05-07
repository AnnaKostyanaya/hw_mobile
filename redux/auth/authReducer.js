
import { createSlice } from "@reduxjs/toolkit";

const state = {
  userId: null,
  login: null,
  email: null,
  stateChange: false,
  photoURL: "",
}

export const authSlice = createSlice({
  name: "auth",
  initialState: state,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      login: payload.login,
      email: payload.email,
      photoURL: payload.photoURL,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    authSignOut: () => state,
    updateSelectedImage: (state, { payload }) => {
      return {
        ...state,
        photoURL: payload,
      };
    },
  },
});