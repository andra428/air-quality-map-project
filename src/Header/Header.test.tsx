import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useIsMobile } from "../hooks/useMediaQuery";
import Header from "./Header";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

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
  ui: { isSettingsModalOpen: false, isProfilePageModalOpen: false },
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

describe("Header component", () => {
  let store: any;
  beforeEach(() => {
    store = configureStore({
      reducer: testReducer,
    });
  });

  test("Header should have a logo", () => {
    mockedUseIsMobile.mockReturnValue(false);
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );
    const logoElement = screen.getByAltText("logoGD");
    expect(logoElement).toBeInTheDocument();
  });
  test("Header should display Clusterizare on a bigger screen (desktop)", () => {
    mockedUseIsMobile.mockReturnValue(false);
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );
    const clusterizareText = screen.getByText("Voronoi clasterization");
    expect(clusterizareText).toBeInTheDocument();
  });
  test("Header should not display Clusterizare on a smaller screen (mobile)", () => {
    mockedUseIsMobile.mockReturnValue(true);
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );
    const clusterizareText = screen.queryByText("Voronoi clasterization");
    expect(clusterizareText).not.toBeInTheDocument();
  });
  test("Header should display SeachBar", () => {
    mockedUseIsMobile.mockReturnValue(true);
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );
    const searchText = screen.getByPlaceholderText("Type address...");
    expect(searchText).toBeInTheDocument();
  });
  test("Header should display Profile when the user is not logged in", () => {
    mockedUseIsMobile.mockReturnValue(false);
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    const settingsButton = screen.getByRole("button", { name: "Settings" });

    expect(settingsButton).toBeInTheDocument();
  });
  test("Header should display Profile when the user is logged in", () => {
    const preloadedStateWithUser = {
      auth: {
        currentUser: {
          displayName: "Test User",
          photoURL: "",
          uid: "",
          email: "",
        },
      },
      ui: { isSettingsModalOpen: false, isProfilePageModalOpen: false },
      device: { devices: [] },
    };
    const testStore = configureStore({
      reducer: combineReducers({
        auth: (state = preloadedStateWithUser.auth) => state,
        ui: (state = preloadedStateWithUser.ui) => state,
        device: (state = preloadedStateWithUser.device) => state,
      }),
    });
    mockedUseIsMobile.mockReturnValue(false);
    render(
      <Provider store={testStore}>
        <Header />
      </Provider>
    );
    const userNameButton = screen.getByRole("button", { name: "Test User" });
    expect(userNameButton).toBeInTheDocument();
  });
});
