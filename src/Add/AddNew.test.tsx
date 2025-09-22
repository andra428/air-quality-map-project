import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AddNew from "./AddNew";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { useIsMobile } from "../hooks/useMediaQuery";
import userEvent from "@testing-library/user-event";
import { saveUserData } from "./CollectionOperations";

import { getLocation } from "./Location";

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
        id: 1,
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
        id: 2,
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
        id: 3,
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
    isAddNewPageModalOpen: true,
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
});

jest.mock("./CollectionOperations", () => ({
  saveUserData: jest.fn(),
}));

jest.mock("./Location", () => ({
  getLocation: jest.fn(),
  getCoordsFromAddress: jest.fn(),
}));

describe("Add Device component", () => {
  let store: any;
  let dispatchSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  beforeEach(() => {
    store = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
    dispatchSpy = jest.spyOn(store, "dispatch");
    jest
      .spyOn(require("../hooks/useAppDispatch"), "useAppDispatch")
      .mockReturnValue(dispatchSpy);
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });
  afterEach(() => {
    consoleLogSpy.mockRestore();
  });
  test("Add New component should display the add gateway component(initial value)", () => {
    const mockClose = jest.fn();
    mockedUseIsMobile.mockReturnValue(false);
    render(
      <Provider store={store}>
        <AddNew onClose={mockClose} />
      </Provider>
    );
    const gatewayInput = screen.getByPlaceholderText("Gateway");
    expect(gatewayInput).toBeInTheDocument();
    const keyTextarea = screen.getByPlaceholderText("Type key");
    expect(keyTextarea).toBeInTheDocument();
  });
  test("Add New component should display the add device component(changed state value)", async () => {
    const mockClose = jest.fn();
    mockedUseIsMobile.mockReturnValue(false);
    render(
      <Provider store={store}>
        <AddNew onClose={mockClose} />
      </Provider>
    );
    const deviceButton = screen.getByText(/Device/i);
    await userEvent.click(deviceButton);

    expect(screen.getByPlaceholderText(/Type name/i)).toBeInTheDocument();
    expect(screen.getByText("Metrics to be tracked")).toBeInTheDocument();
    expect(screen.getByText("Public metrics")).toBeInTheDocument();
  });
  test("Add New component should display the add gateway component if a user clicks the gateway button(changed state value)", async () => {
    const mockClose = jest.fn();
    mockedUseIsMobile.mockReturnValue(false);
    render(
      <Provider store={store}>
        <AddNew onClose={mockClose} />
      </Provider>
    );
    const gatewayButton = screen.getAllByText(/Gateway/i)[0];
    await userEvent.click(gatewayButton);

    expect(screen.queryByPlaceholderText(/Type name/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Metrics to be tracked")).not.toBeInTheDocument();
    expect(screen.queryByText("Public metrics")).not.toBeInTheDocument();
  });

  test("Add New component should render mobile heading when isMobile is true", () => {
    const mockClose = jest.fn();
    mockedUseIsMobile.mockReturnValue(true);

    render(<AddNew onClose={mockClose} />);

    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeInTheDocument();

    expect(screen.getByText("Add new")).toBeInTheDocument();
  });
  test("Add New component should render desktop heading when isMobile is false", () => {
    const mockClose = jest.fn();
    mockedUseIsMobile.mockReturnValue(false);

    render(<AddNew onClose={mockClose} />);

    const closeButton = screen.getByRole("button", { name: /x/i });
    expect(closeButton).toBeInTheDocument();

    expect(screen.getByText("Add new")).toBeInTheDocument();
  });
  test("Add New component should call onClose when clicking close button on desktop", async () => {
    const mockClose = jest.fn();
    mockedUseIsMobile.mockReturnValue(false);

    render(<AddNew onClose={mockClose} />);

    const closeButton = screen.getByRole("button", { name: /x/i });
    await userEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
  test("Add New component should call onClose when clicking back button on mobile", async () => {
    const mockClose = jest.fn();
    mockedUseIsMobile.mockReturnValue(true);

    render(<AddNew onClose={mockClose} />);

    const closeButton = screen.getByRole("button", { name: /back/i });
    await userEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
  test("Add New component should submit the AddDevice form when clicking Add button", async () => {
    const mockClose = jest.fn();
    mockedUseIsMobile.mockReturnValue(false);
    window.alert = jest.fn();
    render(
      <Provider store={store}>
        <AddNew onClose={mockClose} />
      </Provider>
    );

    const deviceButton = screen.getByText(/Device/i);
    await userEvent.click(deviceButton);

    const form = document.querySelector("form") as HTMLFormElement;
    const dispatchSpy = jest.spyOn(form, "dispatchEvent");
    const addButton = screen.getByText(/Add device/i);
    await userEvent.click(addButton);
    expect(dispatchSpy).toHaveBeenCalled();
  });

  test("Add New component should submit AddDevice form when user fills it and clicks Add", async () => {
    render(
      <Provider store={store}>
        <AddNew onClose={jest.fn()} />
      </Provider>
    );
    (getLocation as jest.Mock).mockResolvedValue({
      address: "Iași",
      coords: { lat: 47.15, long: 27.6 },
    });
    (saveUserData as jest.Mock).mockResolvedValue(1);
    const deviceButton = screen.getByText(/Device/i);
    await userEvent.click(deviceButton);

    await userEvent.type(screen.getByPlaceholderText(/Type name/i), "Device X");
    await userEvent.type(
      screen.getByPlaceholderText(/Type description/i),
      "Some Desc"
    );
    const pinButton = screen.getByRole("button", { name: /locPin/i });
    await userEvent.click(pinButton);

    expect(screen.getByPlaceholderText(/Location/i)).toHaveValue("Iași");

    const addButton = screen.getByText(/Add device/i);
    await userEvent.click(addButton);

    expect(saveUserData).toHaveBeenCalledWith(
      expect.objectContaining({
        deviceName: "Device X",
        description: "Some Desc",
        deviceLat: 47.15,
        deviceLong: 27.6,
        deviceAddress: "Iași",
      })
    );
  });
});
