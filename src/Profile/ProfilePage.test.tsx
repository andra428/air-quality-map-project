import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useIsMobile } from "../hooks/useMediaQuery";
import ProfilePage from "./ProfilePage";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import * as uiSlice from "../Auth/uiSlice";
import metricsReducer from "../Auth/metricsSlice";
jest.mock("../hooks/useMediaQuery", () => ({
  useIsMobile: jest.fn(),
}));
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: (node: any) => node,
}));

const mockedUseIsMobile = useIsMobile as jest.Mock<boolean>;

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
    isProfilePageModalOpen: true,
    isEditPageOpen: false,
  },
};

const mockAuthReducerWithUser = (
  state = preloadedStateWithUser.auth,
  action: any
) => {
  if (action.type === "auth/handleSignOut/fulfilled") {
    return { ...state, currentUser: null };
  }
  return state;
};

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

describe("ProfilePage componenent", () => {
  let store: any;
  let dispatchSpy: jest.SpyInstance;
  let windowSpy: any;

  beforeEach(() => {
    store = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
    dispatchSpy = jest.spyOn(store, "dispatch");
    jest
      .spyOn(require("../hooks/useAppDispatch"), "useAppDispatch")
      .mockReturnValue(dispatchSpy);
    windowSpy = jest
      .spyOn(window, "open")
      .mockImplementation(() => ({} as Window));
  });
  test("ProfilePage componenent should display the x button if a user is logged in (desktop)", () => {
    mockedUseIsMobile.mockReturnValue(false);
    const mockClose = jest.fn();
    render(
      <Provider store={store}>
        <ProfilePage onClose={mockClose} />
      </Provider>
    );
    const closeImage = screen.getByRole("img", { name: "x" });

    expect(closeImage).toBeInTheDocument();
  });
  test("ProfilePage componenent should display the back button if a user is logged in (mobile)", () => {
    mockedUseIsMobile.mockReturnValue(true);
    const mockClose = jest.fn();
    render(
      <Provider store={store}>
        <ProfilePage onClose={mockClose} />
      </Provider>
    );
    const closeImage = screen.getByRole("img", { name: "back" });

    expect(closeImage).toBeInTheDocument();
  });
  test("ProfilePage componenent should display the Devices componenent if a user is logged in", () => {
    mockedUseIsMobile.mockReturnValue(false);
    const mockClose = jest.fn();
    render(
      <Provider store={store}>
        <ProfilePage onClose={mockClose} />
      </Provider>
    );
    const deviceList = screen.getByRole("list");
    expect(deviceList).toBeInTheDocument();
    expect(screen.getByText("Galaxy S8")).toBeInTheDocument();
    expect(screen.getByText("Mac")).toBeInTheDocument();
    expect(screen.getByText("PC")).toBeInTheDocument();
  });
  test("ProfilePage componenent should display the Clusterizare componenent if the device is a mobile", () => {
    mockedUseIsMobile.mockReturnValue(true);
    const mockClose = jest.fn();
    render(
      <Provider store={store}>
        <ProfilePage onClose={mockClose} />
      </Provider>
    );
    const clusterizareText = screen.getByText("Voronoi clasterization");
    expect(clusterizareText).toBeInTheDocument();
  });
  test("ProfilePage componenent should open the Add New Page Componenent ", async () => {
    mockedUseIsMobile.mockReturnValue(true);
    const mockClose = jest.fn();
    render(
      <Provider store={store}>
        <ProfilePage onClose={mockClose} />
      </Provider>
    );
    const addButton = screen.getByRole("button", { name: "+ Add new" });
    await userEvent.click(addButton);
    expect(dispatchSpy).toHaveBeenCalledWith(uiSlice.openAddNewPageModal());
  });
  test("ProfilePage componenent should open the GDPR Page ", async () => {
    mockedUseIsMobile.mockReturnValue(false);
    const mockClose = jest.fn();
    render(
      <Provider store={store}>
        <ProfilePage onClose={mockClose} />
      </Provider>
    );
    const privacyButton = screen.getByRole("button", { name: /Privacy/i });
    await userEvent.click(privacyButton);

    expect(windowSpy).toHaveBeenCalledTimes(1);
    expect(windowSpy).toHaveBeenCalledWith("https://gdpr-info.eu/", "_blank");
  });
  test("ProfilePage componenent should sign out the user when it clicks the button Sign Out (desktop)", async () => {
    mockedUseIsMobile.mockReturnValue(false);
    const mockClose = jest.fn();

    render(
      <Provider store={store}>
        <ProfilePage onClose={mockClose} />
      </Provider>
    );
    const signOutButton = screen.getByRole("button", { name: /Sign Out/i });
    await userEvent.click(signOutButton);

    expect(dispatchSpy).toHaveBeenCalled();

    expect(mockClose).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      const userName = screen.queryByText(/Andra Maria/i);
      expect(userName).not.toBeInTheDocument();
    });
  });
});
