import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useInitializeDevices } from "./useInitializaDevices";
import uiReducer from "../Auth/uiSlice";
import * as collectionOps from "../Add/CollectionOperations";
import metricsReducer from "../Auth/metricsSlice";
import { Provider } from "react-redux";
import { act, renderHook, waitFor } from "@testing-library/react";
import deviceReducer from "../Auth/deviceSlice";
import authReducer from "../Auth/authSlice";
jest.mock("../Add/CollectionOperations");
const mockDevices = [
  {
    id: "1",
    description: "My laptop",
    deviceAddress: "Aleea Profesor Vasile Petrescu, Iași,Romania",
    deviceLat: 47.157176969640766,
    deviceLong: 27.60457611625316,
    deviceName: "Mac",
    userEmail: "alupu@griddynamics.com",
    userId: "GW7cGeR2aJcc8RJvhZXcbWu7Fwk2",
    userName: "Andra Maria Lupu",
  },
  {
    id: "2",
    description: "Camin T6",
    deviceAddress:
      "Aleea Profesor Gheorghe Alexa, Tudor Vladimirescu, Iași, Iași Metropolitan Area, Iași, 700562, Romania",
    deviceLat: 47.154842,
    deviceLong: 27.6075295,
    deviceName: "PC",
    userEmail: "alupu@griddynamics.com",
    userId: "GW7cGeR2aJcc8RJvhZXcbWu7Fwk2",
    userName: "Andra Maria Lupu",
  },
  {
    id: "3",
    description: "Samsung",
    deviceAddress: "Bulevardul Chimiei, Iași, Romania",
    deviceLat: 47.15298272334212,
    deviceLong: 27.607666009413876,
    deviceName: "Galaxy S8",
    userEmail: "alupu@griddynamics.com",
    userId: "GW7cGeR2aJcc8RJvhZXcbWu7Fwk2",
    userName: "Andra Maria Lupu",
  },
  {
    id: "4",
    userName: "John Doe",
    userEmail: "john@example.com",
    userId: "uid123",
    deviceName: "Device1",
    description: "Test device",
    deviceLat: 10,
    deviceLong: 20,
    deviceAddress: "Address1",
  },
];

const preloadedStateWithUser = {
  auth: {
    currentUser: {
      displayName: "Andra Maria Lupu",
      photoURL: "",
      uid: "GW7cGeR2aJcc8RJvhZXcbWu7Fwk2",
      email: "alupu@griddynamics.com",
    },
  },
  device: {
    devices: [],
    selectedDevice: null,
  },
  ui: {
    isSettingsModalOpen: false,
    isProfilePageModalOpen: false,
    isEditPageOpen: true,
    isRemoveDevicePageOpen: false,
    isAddNewPageModalOpen: false,
    isMessagePageOpen: false,
    editingDeviceId: "3",
    messageText: null,
    messageType: null,
    isMetricsPageOpen: false,
    metricsDeviceId: null,
    lastDeviceId: "3",
  },
  metrics: {
    "1": {
      current: {
        metrics: {
          city_name: "Iași",
          country_code: "RO",
          pm25: 12,
          co: 30,
          aqi: 50,
        },
        temp: 23,
      },
      today: undefined,
      week: undefined,
    },
  },
};

const testReducerWithUser = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  device: deviceReducer,
  metrics: metricsReducer,
});

describe("useInitializaDevices", () => {
  let store: any;
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  beforeEach(() => {
    store = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("dispatches setDevices when getDocuments succeeds", async () => {
    (collectionOps.getDocuments as jest.Mock).mockResolvedValue(mockDevices);

    renderHook(() => useInitializeDevices(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      const state = store.getState();
      expect(state.device.devices).toEqual(mockDevices);
    });
  });
  test("sets devices to [] when getDocuments fails", async () => {
    (collectionOps.getDocuments as jest.Mock).mockRejectedValue(
      new Error("Firestore error")
    );

    renderHook(() => useInitializeDevices(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      expect(store.getState().device.devices).toEqual([]);
    });
  });
  test("sets devices to [] if the is no currentUser", async () => {
    const storeNoUser = configureStore({
      reducer: testReducerWithUser,
      preloadedState: {
        ...preloadedStateWithUser,
        auth: { currentUser: null },
      },
    });

    renderHook(() => useInitializeDevices(), {
      wrapper: ({ children }) => (
        <Provider store={storeNoUser}>{children}</Provider>
      ),
    });

    await waitFor(() => {
      expect(store.getState().device.devices).toEqual([]);
    });
    consoleSpy.mockRestore();
  });
  test("clears devices on logout and refetches on login", async () => {
    (collectionOps.getDocuments as jest.Mock).mockImplementation(() => {
      const state = store.getState();
      return state.auth.currentUser ? mockDevices : [];
    });

    renderHook(() => useInitializeDevices(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      expect(store.getState().device.devices).toEqual(mockDevices);
    });

    act(() => {
      store.dispatch({ type: "auth/setUser", payload: null });
    });

    await waitFor(() => {
      expect(store.getState().device.devices).toEqual([]);
    });

    act(() => {
      store.dispatch({
        type: "auth/setUser",
        payload: {
          uid: "userB",
          email: "userB@example.com",
          displayName: "User B",
          photoURL: null,
        },
      });
    });

    await waitFor(() => {
      expect(store.getState().device.devices).toEqual(mockDevices);
    });

    expect(collectionOps.getDocuments).toHaveBeenCalledTimes(3);
  });
  test("returns empty devices array when user is logged in but no devices exist", async () => {
    (collectionOps.getDocuments as jest.Mock).mockResolvedValue([]);

    renderHook(() => useInitializeDevices(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      const state = store.getState();
      expect(state.device.devices).toEqual([]);
    });

    expect(collectionOps.getDocuments).toHaveBeenCalledTimes(1);
  });
});
