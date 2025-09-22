import { combineReducers, configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import Device from "./Device";
import uiReducer from "../Auth/uiSlice";
import metricsReducer from "../Auth/metricsSlice";
import userEvent from "@testing-library/user-event";
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
      current: undefined,
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

describe("Device component", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
  });

  test("renders the device's name and address", () => {
    render(
      <Provider store={store}>
        <Device device={preloadedStateWithUser.device.devices[0]} />
      </Provider>
    );

    expect(screen.getByText("Mac")).toBeInTheDocument();
    expect(
      screen.getByText("Aleea Profesor Vasile Petrescu, Iași,Romania")
    ).toBeInTheDocument();
  });
  test("renders the edit button if the device is owned by the current user", () => {
    render(
      <Provider store={store}>
        <Device device={preloadedStateWithUser.device.devices[0]} />
      </Provider>
    );

    expect(screen.getByText("Mac")).toBeInTheDocument();
    expect(
      screen.getByText("Aleea Profesor Vasile Petrescu, Iași,Romania")
    ).toBeInTheDocument();
    const editBtn = screen.getByRole("button", { name: /Edit/i });
    expect(editBtn).toBeInTheDocument();
  });
  test("does not render the edit button if the device is not owned by the current user", () => {
    render(
      <Provider store={store}>
        <Device device={preloadedStateWithUser.device.devices[3]} />
      </Provider>
    );

    expect(screen.queryByText("Mac")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Aleea Profesor Vasile Petrescu, Iași,Romania")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Device1")).toBeInTheDocument();
    const editBtn = screen.queryByRole("button", { name: /Edit/i });
    expect(editBtn).not.toBeInTheDocument();
  });
  test("renders fallback 'O' when no currentData is available", () => {
    render(
      <Provider store={store}>
        <Device device={preloadedStateWithUser.device.devices[0]} />
      </Provider>
    );

    expect(screen.getByText("O")).toBeInTheDocument();
  });
  test("dispatches closeProfilePageModal and openEditPage, updating the store when the user clicks the edit button", async () => {
    render(
      <Provider store={store}>
        <Device device={preloadedStateWithUser.device.devices[0]} />
      </Provider>
    );

    const editButton = screen.getByRole("button", { name: /Edit/i });
    await userEvent.click(editButton);

    const state = store.getState();
    expect(state.ui.isProfilePageModalOpen).toBe(false);
    expect(state.ui.isEditPageOpen).toBe(true);
    expect(state.ui.editingDeviceId).toBe(
      preloadedStateWithUser.device.devices[0].id
    );
  });
  test("dispatches closeProfilePageModal, closeEditPage and openMetricsPage, updating the store when the user clicks the button with the current device's name", async () => {
    render(
      <Provider store={store}>
        <Device device={preloadedStateWithUser.device.devices[0]} />
      </Provider>
    );

    const editButton = screen.getByRole("button", {
      name: preloadedStateWithUser.device.devices[0].deviceName,
    });
    await userEvent.click(editButton);

    const state = store.getState();
    expect(state.ui.isProfilePageModalOpen).toBe(false);
    expect(state.ui.isEditPageOpen).toBe(false);
    expect(state.ui.isMetricsPageOpen).toBe(true);
    expect(state.ui.metricsDeviceId).toBe(
      preloadedStateWithUser.device.devices[0].id
    );
  });
  test("dispatches fetchCurrentData if currentData is undefined", async () => {
    const device: DeviceData = preloadedStateWithUser.device.devices[0];
    const fetchSpy = jest.spyOn(metricsSlice, "fetchCurrentData");

    render(
      <Provider store={store}>
        <Device device={device} />
      </Provider>
    );

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(device);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });
  test("renders the current device's metrics data", async () => {
    const device: DeviceData = preloadedStateWithUser.device.devices[0];

    const stateWithCurrentData = {
      ...preloadedStateWithUser,
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
    const mockMetricsReducer = (
      state = stateWithCurrentData.metrics,
      _action: any
    ) => state;
    const storeWithCurrentData = configureStore({
      reducer: {
        auth: mockAuthReducerWithUser,
        ui: uiReducer,
        device: mockDevicesReducerWithUser,
        metrics: mockMetricsReducer,
      },
    });

    render(
      <Provider store={storeWithCurrentData}>
        <Device device={device} />
      </Provider>
    );

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText(/23/)).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
    expect(screen.queryByText("O")).not.toBeInTheDocument();
  });
  test("does not dispatch fetchCurrentData if currentData is defined", async () => {
    const device: DeviceData = preloadedStateWithUser.device.devices[0];

    const stateWithCurrentData = {
      ...preloadedStateWithUser,
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

    const mockMetricsReducer = (
      state = stateWithCurrentData.metrics,
      _action: any
    ) => state;

    const storeWithCurrentData = configureStore({
      reducer: {
        auth: mockAuthReducerWithUser,
        ui: uiReducer,
        device: mockDevicesReducerWithUser,
        metrics: mockMetricsReducer,
      },
      preloadedState: stateWithCurrentData,
    });

    const dispatchMock = jest.fn();
    storeWithCurrentData.dispatch = dispatchMock;

    render(
      <Provider store={storeWithCurrentData}>
        <Device device={device} />
      </Provider>
    );

    await waitFor(() => {
      expect(dispatchMock).not.toHaveBeenCalledWith(expect.any(Function));
    });
  });
});
