import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import Profile from "./Profile";
import * as uiSlice from "../Auth/uiSlice";
import { useIsMobile } from "../hooks/useMediaQuery";

jest.mock("../hooks/useMediaQuery", () => ({
  useIsMobile: jest.fn(),
}));
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: (node: any) => node,
}));

const mockedUseIsMobile = useIsMobile as jest.Mock<boolean>;

const preloadedState = {
  auth: { currentUser: null },
  device: { devices: [] },
  ui: {
    isSettingsModalOpen: false,
    isProfilePageModalOpen: false,
    isEditPageOpen: false,
  },
};

const mockAuthReducer = (state = preloadedState.auth, _action: any) => state;
const mockUiReducer = (state = preloadedState.ui, _action: any) => state;
const mockDevicesReducer = (state = preloadedState.device, _action: any) =>
  state;

const testReducer = combineReducers({
  auth: mockAuthReducer,
  ui: mockUiReducer,
  device: mockDevicesReducer,
});

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
});

describe("Profile Componenent", () => {
  let store: any;
  let dispatchSpy: jest.SpyInstance;
  beforeEach(() => {
    store = configureStore({
      reducer: testReducer,
      preloadedState: preloadedState,
    });
    dispatchSpy = jest.spyOn(store, "dispatch");
    jest
      .spyOn(require("../hooks/useAppDispatch"), "useAppDispatch")
      .mockReturnValue(dispatchSpy);
  });
  test("Profile should display the settings button if a user is not logged in (desktop)", () => {
    mockedUseIsMobile.mockReturnValue(false);
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );
    const settingsButton = screen.getByRole("button", { name: "Settings" });
    expect(settingsButton).toBeInTheDocument();
  });
  test("Profile should display the name of the user in a button if a user if logged in (desktop)", () => {
    mockedUseIsMobile.mockReturnValue(false);
    const testStore = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });

    render(
      <Provider store={testStore}>
        <Profile />
      </Provider>
    );
    const settingsButton = screen.getByRole("button", { name: "Andra Maria" });
    expect(settingsButton).toBeInTheDocument();
  });
  test("Profile component should not appear if its a mobile device (user not logged in)", () => {
    mockedUseIsMobile.mockReturnValue(true);
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );
    const settingsButton = screen.queryByRole("button", { name: "Settings" });
    expect(settingsButton).not.toBeInTheDocument();
  });
  test("Profile component should not appear if its a mobile device (user logged in)", () => {
    mockedUseIsMobile.mockReturnValue(true);
    const testStore = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });

    render(
      <Provider store={testStore}>
        <Profile />
      </Provider>
    );
    const settingsButton = screen.queryByRole("button", {
      name: "Andra Maria",
    });
    expect(settingsButton).not.toBeInTheDocument();
  });
  test("Profile componenent should display Settings componenent if the user is not logged in", async () => {
    mockedUseIsMobile.mockReturnValue(false);
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );
    const settingsButton = screen.getByRole("button", { name: "Settings" });
    await userEvent.click(settingsButton);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(uiSlice.openSettingsModal());
  });
  test("Profile componenent should display Profile Page componenent if the user is logged in", async () => {
    mockedUseIsMobile.mockReturnValue(false);
    const testStore = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
    dispatchSpy = jest.spyOn(testStore, "dispatch");
    jest
      .spyOn(require("../hooks/useAppDispatch"), "useAppDispatch")
      .mockReturnValue(dispatchSpy);
    render(
      <Provider store={testStore}>
        <Profile />
      </Provider>
    );
    const settingsButton = screen.getByRole("button", { name: "Andra Maria" });
    await userEvent.click(settingsButton);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(uiSlice.openProfilePageModal());
  });
});
