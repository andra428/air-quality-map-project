import { combineReducers, configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import HourMetrics from "./HourMetrics";
import uiReducer from "../Auth/uiSlice";
import metricsReducer from "../Auth/metricsSlice";
import { DeviceData } from "../Auth/deviceSlice";
import * as metricsSlice from "../Auth/metricsSlice";
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

describe("HourMetrics component", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
  });
  test("renders PM2.5 metrics correctly", () => {
    render(
      <Provider store={store}>
        <HourMetrics
          type="pm25"
          device={preloadedStateWithUser.device.devices[0]}
        />
      </Provider>
    );

    expect(screen.getByText("PM2.5")).toBeInTheDocument();
    expect(screen.getByText("Normal range: 1 - 9")).toBeInTheDocument();
    expect(screen.getByText("12.0")).toBeInTheDocument();
  });
  test("renders CO2 metrics correctly", () => {
    render(
      <Provider store={store}>
        <HourMetrics
          type="co2"
          device={preloadedStateWithUser.device.devices[0]}
        />
      </Provider>
    );

    expect(screen.getByText("CO2")).toBeInTheDocument();
    expect(screen.getByText("Normal range < 1000")).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();
  });
  test("renders AQI metrics correctly", () => {
    render(
      <Provider store={store}>
        <HourMetrics
          type="aqi"
          device={preloadedStateWithUser.device.devices[0]}
        />
      </Provider>
    );

    expect(screen.getByText("AQI")).toBeInTheDocument();
    expect(screen.getByText("Air Quality Index")).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });
  test("renders Temp metrics correctly", () => {
    render(
      <Provider store={store}>
        <HourMetrics
          type="temp"
          device={preloadedStateWithUser.device.devices[0]}
        />
      </Provider>
    );

    expect(screen.getByText("Temp")).toBeInTheDocument();
    expect(screen.getByText("In Celsius")).toBeInTheDocument();
    expect(screen.getByText(/23/)).toBeInTheDocument();
  });
  test("does not dispatch fetchCurrentData if currentData is defined", async () => {
    const mockMetricsReducer = (
      state = preloadedStateWithUser.metrics,
      _action: any
    ) => state;

    const storeWithCurrentData = configureStore({
      reducer: {
        auth: mockAuthReducerWithUser,
        ui: uiReducer,
        device: mockDevicesReducerWithUser,
        metrics: mockMetricsReducer,
      },
      preloadedState: preloadedStateWithUser,
    });

    const fetchSpy = jest.spyOn(metricsSlice, "fetchCurrentData");

    render(
      <Provider store={storeWithCurrentData}>
        <HourMetrics
          type="pm25"
          device={preloadedStateWithUser.device.devices[0]}
        />
      </Provider>
    );

    await waitFor(() => {
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });
  test("dispatches fetchCurrentData if currentData is undefined", async () => {
    const device: DeviceData = preloadedStateWithUser.device.devices[0];
    const stateWithoutCurrent = {
      ...preloadedStateWithUser,
      metrics: {
        "1": {
          current: undefined,
          today: undefined,
          week: undefined,
        },
      },
    };
    const mockMetricsReducer = (
      state = stateWithoutCurrent.metrics,
      _action: any
    ) => state;

    const storeWithoutCurrent = configureStore({
      reducer: {
        auth: mockAuthReducerWithUser,
        ui: uiReducer,
        device: mockDevicesReducerWithUser,
        metrics: mockMetricsReducer,
      },
      preloadedState: stateWithoutCurrent,
    });

    const fetchSpy = jest.spyOn(metricsSlice, "fetchCurrentData");

    render(
      <Provider store={storeWithoutCurrent}>
        <HourMetrics type="pm25" device={device} />
      </Provider>
    );

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(device);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });
  test("does not render if no device is provided", () => {
    const { container } = render(
      <Provider store={store}>
        <HourMetrics type="pm25" device={undefined} />
      </Provider>
    );
    expect(container.firstChild).toBeNull();
  });
});
