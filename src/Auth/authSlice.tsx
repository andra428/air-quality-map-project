import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

export interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  currentUser: SerializableUser | null;
}

const initialState: AuthState = {
  currentUser: null,
};

function toSerializableUser(user: User | null): SerializableUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      return toSerializableUser(result.user);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const handleSignOut = createAsyncThunk(
  "auth/handleSignOut",
  async () => {
    try {
      await signOut(auth);
      return null;
    } catch (error: any) {
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<SerializableUser | null>) {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(handleSignOut.fulfilled, (state) => {
        state.currentUser = null;
      });
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
