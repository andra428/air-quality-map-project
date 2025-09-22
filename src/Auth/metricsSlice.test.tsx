import { combineReducers, configureStore } from "@reduxjs/toolkit";
import metricsReducer, {
  fetchCurrentData,
  fetchTodayDataThunk,
  fetchWeekDataThunk,
} from "./metricsSlice";
import * as WeatherAPI from "../Add/WeatherAPI";
import uiReducer from "../Auth/uiSlice";
jest.mock("../Add/WeatherAPI");
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

describe("metricsSlice", () => {
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
  test("should have empty initial state", () => {
    const state = store.getState().metrics;
    expect(state).toEqual({});
  });

  test("should handle fetchCurrentData.fulfilled", async () => {
    const mockMetrics = { pm25: 10, co2: 400, aqi: 50 };
    const mockTemp = 22;

    (WeatherAPI.getCurrentMetrics as jest.Mock).mockResolvedValue(mockMetrics);
    (WeatherAPI.getCurrentTemp as jest.Mock).mockResolvedValue(mockTemp);

    await store.dispatch(
      fetchCurrentData(preloadedStateWithUser.device.devices[0]) as any
    );

    const state = store.getState().metrics;
    expect(state[preloadedStateWithUser.device.devices[0].id].current).toEqual({
      metrics: mockMetrics,
      temp: mockTemp,
    });
  });
  test("should throw error if fetchCurrentData returns null metrics", async () => {
    const mockDevice = preloadedStateWithUser.device.devices[0];
    (WeatherAPI.getCurrentMetrics as jest.Mock).mockResolvedValue(null);
    (WeatherAPI.getCurrentTemp as jest.Mock).mockResolvedValue(22);

    const action = await store.dispatch(fetchCurrentData(mockDevice) as any);
    expect(action.type).toBe("metrics/fetchCurrentData/rejected");
    expect(action.error.message).toBe("No metrics found");
  });
  test("should reject fetchCurrentData if getCurrentTemp fails", async () => {
    const mockDevice = preloadedStateWithUser.device.devices[0];
    (WeatherAPI.getCurrentMetrics as jest.Mock).mockResolvedValue({
      pm25: 10,
      co2: 400,
      aqi: 50,
    });
    (WeatherAPI.getCurrentTemp as jest.Mock).mockRejectedValue(
      new Error("Temp API Error")
    );

    const action = await store.dispatch(fetchCurrentData(mockDevice) as any);
    expect(action.type).toBe("metrics/fetchCurrentData/rejected");
    expect(action.error.message).toBe("Temp API Error");
  });
  test("should handle fetchTodayDataThunk.fulfilled", async () => {
    const mockDevice = preloadedStateWithUser.device.devices[0];
    const todayData = {
      pm25: [{ hour: 0, value: 10 }],
      co2: [{ hour: 0, value: 400 }],
      aqi: [{ hour: 0, value: 50 }],
      temp: [{ hour: 0, value: 22 }],
    };

    (WeatherAPI.fetchTodayData as jest.Mock).mockResolvedValue(todayData);

    await store.dispatch(fetchTodayDataThunk(mockDevice) as any);

    const state = store.getState().metrics;
    expect(state[mockDevice.id].today).toEqual(todayData);
  });
  test("should handle fetchTodayDataThunk.rejected", async () => {
    const mockDevice = preloadedStateWithUser.device.devices[0];
    (WeatherAPI.fetchTodayData as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    const action = await store.dispatch(fetchTodayDataThunk(mockDevice) as any);
    expect(action.type).toBe("metrics/fetchTodayData/rejected");
    expect(action.error.message).toBe("API Error");
  });
  test("should handle fetchWeekDataThunk.fulfilled", async () => {
    const mockDevice = preloadedStateWithUser.device.devices[0];
    const weekData = {
      pm25: [{ hour: 0, value: 10 }],
      co2: [{ hour: 0, value: 400 }],
      aqi: [{ hour: 0, value: 50 }],
      temp: [{ hour: 0, value: 22 }],
    };

    (WeatherAPI.fetchWeekData as jest.Mock).mockResolvedValue(weekData);

    await store.dispatch(fetchWeekDataThunk(mockDevice) as any);

    const state = store.getState().metrics;
    expect(state[mockDevice.id].week).toEqual(weekData);
  });
  test("should handle fetchWeekDataThunk.rejected", async () => {
    const mockDevice = preloadedStateWithUser.device.devices[0];
    (WeatherAPI.fetchWeekData as jest.Mock).mockRejectedValue(
      new Error("Week API Error")
    );

    const action = await store.dispatch(fetchWeekDataThunk(mockDevice) as any);
    expect(action.type).toBe("metrics/fetchWeekData/rejected");
    expect(action.error.message).toBe("Week API Error");
  });
  test("should initialize state for a new device", async () => {
    const newDevice = preloadedStateWithUser.device.devices[3];
    const currentData = { pm25: 5, co2: 300, aqi: 20 };
    const temp = 18;

    (WeatherAPI.getCurrentMetrics as jest.Mock).mockResolvedValue(currentData);
    (WeatherAPI.getCurrentTemp as jest.Mock).mockResolvedValue(temp);

    await store.dispatch(fetchCurrentData(newDevice) as any);

    const state = store.getState().metrics;
    expect(state[newDevice.id].current).toEqual({ metrics: currentData, temp });
    expect(state[newDevice.id].today).toBeUndefined();
    expect(state[newDevice.id].week).toBeUndefined();
  });

  test("should store metrics for multiple devices separately", async () => {
    const device1 = preloadedStateWithUser.device.devices[0];
    const device2 = preloadedStateWithUser.device.devices[1];

    (WeatherAPI.getCurrentMetrics as jest.Mock)
      .mockResolvedValueOnce({ pm25: 10, co2: 400, aqi: 50 })
      .mockResolvedValueOnce({ pm25: 15, co2: 350, aqi: 40 });
    (WeatherAPI.getCurrentTemp as jest.Mock)
      .mockResolvedValueOnce(22)
      .mockResolvedValueOnce(20);

    await store.dispatch(fetchCurrentData(device1) as any);
    await store.dispatch(fetchCurrentData(device2) as any);

    const state = store.getState().metrics;
    expect(state[device1.id].current.temp).toBe(22);
    expect(state[device2.id].current.temp).toBe(20);
  });
});
