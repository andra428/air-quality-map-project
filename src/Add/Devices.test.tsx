import { combineReducers, configureStore } from "@reduxjs/toolkit";
import Devices from "./Devices";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { DeviceData } from "../Auth/deviceSlice";
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
        description: "Tablet",
        deviceAddress: "Strada Stefan cel Mare, Iași,Romania",
        deviceLat: 47.23,
        deviceLong: 27.75,
        deviceName: "Device",
        userEmail: "vspiridon@griddynamics.com",
        userId: "akaklnksnkjdnk",
        userName: "Vlad Spiridon",
      },
    ],
  },
  ui: {
    isSettingsModalOpen: false,
    isProfilePageModalOpen: false,
    isEditPageOpen: false,
  },
};

const mockAuthReducerWithUser = (
  state = preloadedStateWithUser.auth,
  _action: any
) => state;
const mockUiReducerWithUser = (
  state = preloadedStateWithUser.ui,
  _action: any
) => state;
const mockDevicesReducerWithUser = (
  state = preloadedStateWithUser.device,
  _action: any
) => state;
const testReducerWithUser = combineReducers({
  auth: mockAuthReducerWithUser,
  ui: mockUiReducerWithUser,
  device: mockDevicesReducerWithUser,
  metrics: metricsReducer,
});

describe("Devices component", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
  });
  test("renders only devices of current user", () => {
    render(
      <Provider store={store}>
        <Devices />
      </Provider>
    );

    const state = store.getState();
    const currentUserId = state.auth.currentUser.uid;
    const userDevices = state.device.devices.filter(
      (d: DeviceData) => d.userId === currentUserId
    );

    userDevices.forEach((device: DeviceData) => {
      expect(screen.getByText(device.deviceName)).toBeInTheDocument();
    });

    const otherDevices = state.device.devices.filter(
      (d: DeviceData) => d.userId !== currentUserId
    );
    otherDevices.forEach((device: DeviceData) => {
      expect(screen.queryByText(device.deviceName)).not.toBeInTheDocument();
    });
  });

  test("renders nothing if current user has no devices", () => {
    const emptyState = {
      ...preloadedStateWithUser,
      device: { devices: [] },
    };
    const emptyStore = configureStore({
      reducer: testReducerWithUser,
      preloadedState: emptyState,
    });

    const { container } = render(
      <Provider store={emptyStore}>
        <Devices />
      </Provider>
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("each Device displays its name", () => {
    render(
      <Provider store={store}>
        <Devices />
      </Provider>
    );

    preloadedStateWithUser.device.devices
      .filter((d) => d.userId === preloadedStateWithUser.auth.currentUser.uid)
      .forEach((device) => {
        expect(screen.getByText(device.deviceName)).toBeInTheDocument();
      });
  });
});
