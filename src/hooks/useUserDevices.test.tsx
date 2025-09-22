import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useUserDevices } from "./useUserDevices";
import uiReducer from "../Auth/uiSlice";
import metricsReducer from "../Auth/metricsSlice";
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
    devices: [
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
    ],
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

const mockAuthReducerWithUser = (
  state = preloadedStateWithUser.auth,
  _action: any
) => state;
const mockDevicesReducerWithUser = (
  state = preloadedStateWithUser.device,
  _action: any
) => state;

const testReducerWithUser = combineReducers({
  auth: mockAuthReducerWithUser,
  ui: uiReducer,
  device: mockDevicesReducerWithUser,
  metrics: metricsReducer,
});

describe("useUserDevices", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
  });
  test("returns only devices for current user", () => {
    const { result } = renderHook(() => useUserDevices(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    const expectedUserDevices = [
      { id: "1", deviceName: "Mac", userName: "Andra Maria Lupu" },
      { id: "2", deviceName: "PC", userName: "Andra Maria Lupu" },
      { id: "3", deviceName: "Galaxy S8", userName: "Andra Maria Lupu" },
    ];

    expect(result.current).toHaveLength(expectedUserDevices.length);
    expect(result.current).toEqual(
      expect.arrayContaining(
        expectedUserDevices.map((device) => expect.objectContaining(device))
      )
    );
    expect(result.current).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userName: "John Doe",
        }),
      ])
    );
  });
  test("returns an empty array when there is no current user", () => {
    const preloadedStateWithoutUser = {
      auth: {
        currentUser: null,
      },
      device: {
        devices: [],
        selectedDevice: null,
      },
      ui: preloadedStateWithUser.ui,
      metrics: {},
    } as any;

    const storeWithoutUser = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithoutUser,
    });

    const { result } = renderHook(() => useUserDevices(), {
      wrapper: ({ children }) => (
        <Provider store={storeWithoutUser}>{children}</Provider>
      ),
    });

    expect(result.current).toEqual([]);
  });
  test("returns an empty array when the current user has no devices", () => {
    const preloadedStateWithUserNoDevices = {
      ...preloadedStateWithUser,
      device: {
        devices: [],
        selectedDevice: null,
      },
    };

    const storeWithUserNoDevices = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUserNoDevices,
    });

    const { result } = renderHook(() => useUserDevices(), {
      wrapper: ({ children }) => (
        <Provider store={storeWithUserNoDevices}>{children}</Provider>
      ),
    });

    expect(result.current).toEqual([]);
  });
});
