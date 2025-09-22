import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer, {
  setUser,
  signInWithGoogle,
  handleSignOut,
  SerializableUser,
} from "./authSlice";
import * as firebaseAuth from "firebase/auth";

import devicesReducer from "./deviceSlice";
import uiReducer from "../Auth/uiSlice";
import metricsReducer from "./metricsSlice";
jest.mock("../firebaseConfig", () => ({
  db: {},
  auth: {},
}));

jest.mock("firebase/auth", () => ({
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  auth: {},
}));

const preloadedStateWithUser = {
  auth: {
    currentUser: null,
  },
  device: {
    devices: [],
    selectedDevice: null,
  },
  ui: {
    isSettingsModalOpen: false,
    isProfilePageModalOpen: false,
    isEditPageOpen: false,
    isRemoveDevicePageOpen: false,
    isAddNewPageModalOpen: false,
    isMessagePageOpen: false,
    editingDeviceId: null,
    messageText: null,
    messageType: null,
    isMetricsPageOpen: false,
    metricsDeviceId: null,
    lastDeviceId: null,
  },
  metrics: {},
};

const testReducerWithUser = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  device: devicesReducer,
  metrics: metricsReducer,
});
describe("authSlice", () => {
  let store: any;
  beforeEach(() => {
    store = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test("should set and clear user", () => {
    const mockUser: SerializableUser = {
      uid: "123",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: null,
    };

    store.dispatch(setUser(mockUser));
    expect(store.getState().auth.currentUser).toEqual(mockUser);

    store.dispatch(setUser(null));
    expect(store.getState().auth.currentUser).toBeNull();
  });
  test("signInWithGoogle should set user on success", async () => {
    const mockUser: any = {
      uid: "123",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: null,
    };
    (firebaseAuth.signInWithPopup as jest.Mock).mockResolvedValue({
      user: mockUser,
    });

    await store.dispatch(signInWithGoogle() as any);

    expect(store.getState().auth.currentUser).toEqual(mockUser);
  });
  test("signInWithGoogle should reject on failure", async () => {
    (firebaseAuth.signInWithPopup as jest.Mock).mockRejectedValue(
      new Error("Popup failed")
    );

    const action = await store.dispatch(signInWithGoogle() as any);

    expect(action.type).toBe("auth/signInWithGoogle/rejected");
    expect(action.payload).toBe("Popup failed");
  });
  test("signInWithGoogle should return null if user is null", async () => {
    (firebaseAuth.signInWithPopup as jest.Mock).mockResolvedValue({
      user: null,
    });

    const action = await store.dispatch(signInWithGoogle() as any);

    expect(action.type).toBe("auth/signInWithGoogle/fulfilled");
    expect(store.getState().auth.currentUser).toBeNull();
  });

  test("handleSignOut should clear user on success", async () => {
    (firebaseAuth.signOut as jest.Mock).mockResolvedValue(null);

    const storeNoUser = configureStore({
      reducer: testReducerWithUser,
      preloadedState: {
        ...preloadedStateWithUser,
        auth: {
          currentUser: {
            uid: "123",
            email: "test@example.com",
            displayName: "Test User",
            photoURL: "",
          },
        },
      },
    });
    await storeNoUser.dispatch(handleSignOut() as any);
    expect(storeNoUser.getState().auth.currentUser).toBeNull();
  });
  test("handleSignOut should reject on failure", async () => {
    (firebaseAuth.signOut as jest.Mock).mockRejectedValue(
      new Error("Sign out failed")
    );
    const action = await store.dispatch(handleSignOut() as any);

    expect(action.type).toBe("auth/handleSignOut/rejected");
    expect(action.error.message).toBe("Sign out failed");
  });
});
