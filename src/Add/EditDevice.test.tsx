import { combineReducers, configureStore } from "@reduxjs/toolkit";
import EditDevice from "./EditDevice";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { getLocation } from "./Location";
import { RefObject } from "react";
import userEvent from "@testing-library/user-event";

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

const mockFormRef: RefObject<HTMLFormElement> = {
  current: document.createElement("form"),
};

jest.mock("./Location", () => ({
  getLocation: jest.fn(),
}));

describe("EditDevice component", () => {
  let store: any;
  let dispatchSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  const mockDevice = {
    id: "3",
    description: "Samsung",
    deviceAddress: "Bulevardul Chimiei, Iași, Romania",
    deviceLat: 47.15298272334212,
    deviceLong: 27.607666009413876,
    deviceName: "Galaxy S8",
    userEmail: "alupu@griddynamics.com",
    userId: "GW7cGeR2aJcc8RJvhZXcbWu7Fwk2",
    userName: "Andra Maria Lupu",
  };
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
  test("should display the metrics components (initial value)", () => {
    render(
      <Provider store={store}>
        <EditDevice
          formRef={mockFormRef}
          device={mockDevice}
          onUpdateCoords={jest.fn()}
        />
      </Provider>
    );
    expect(screen.getByDisplayValue("Galaxy S8")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Samsung")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Bulevardul Chimiei, Iași, Romania")
    ).toBeInTheDocument();
    expect(screen.getByText("Metrics to be tracked")).toBeInTheDocument();
    expect(screen.getByText("Public metrics")).toBeInTheDocument();
  });
  test("should not display the metrics components (changed value)", async () => {
    render(
      <Provider store={store}>
        <EditDevice
          formRef={mockFormRef}
          device={mockDevice}
          onUpdateCoords={jest.fn()}
        />
      </Provider>
    );
    const changeStateButton = screen.getByRole("button", {
      name: /Single Value/i,
    });
    await userEvent.click(changeStateButton);
    expect(screen.queryByText("Metrics to be tracked")).not.toBeInTheDocument();
    expect(screen.queryByText("Public metrics")).not.toBeInTheDocument();
    expect(screen.getByDisplayValue("Galaxy S8")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Samsung")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Bulevardul Chimiei, Iași, Romania")
    ).toBeInTheDocument();
  });
  test("should display the metrics components (changed value again)", async () => {
    render(
      <Provider store={store}>
        <EditDevice
          formRef={mockFormRef}
          device={mockDevice}
          onUpdateCoords={jest.fn()}
        />
      </Provider>
    );
    const changeStateButton = screen.getByRole("button", {
      name: /JSON Value/i,
    });
    await userEvent.click(changeStateButton);
    expect(screen.queryByText("Metrics to be tracked")).toBeInTheDocument();
    expect(screen.queryByText("Public metrics")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Galaxy S8")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Samsung")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Bulevardul Chimiei, Iași, Romania")
    ).toBeInTheDocument();
  });
  test("updates deviceName and description on user input", async () => {
    render(
      <Provider store={store}>
        <EditDevice
          formRef={mockFormRef}
          device={mockDevice}
          onUpdateCoords={jest.fn()}
        />
      </Provider>
    );

    const nameInput = screen.getByDisplayValue("Galaxy S8");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "My MacBook");

    const descInput = screen.getByDisplayValue("Samsung");
    await userEvent.clear(descInput);
    await userEvent.type(descInput, "Laptop personal");

    expect(nameInput).toHaveValue("My MacBook");
    expect(descInput).toHaveValue("Laptop personal");
  });
  test("calls getLocation and updates location input + onUpdateCoords", async () => {
    const mockGetLocation = getLocation as jest.Mock;
    const mockCoords = { lat: 50, long: 30 };
    mockGetLocation.mockResolvedValue({
      address: "Strada Noua, Iași, Romania",
      coords: mockCoords,
    });

    const mockUpdateCoords = jest.fn();

    render(
      <Provider store={store}>
        <EditDevice
          formRef={mockFormRef}
          device={mockDevice}
          onUpdateCoords={mockUpdateCoords}
        />
      </Provider>
    );

    const button = screen.getByRole("button", { name: /locPin/i });
    await userEvent.click(button);

    expect(
      await screen.findByDisplayValue("Strada Noua, Iași, Romania")
    ).toBeInTheDocument();
    expect(mockUpdateCoords).toHaveBeenCalledWith(mockCoords, true);
  });
  test("shows alert when getLocation throws error", async () => {
    const mockUpdateCoords = jest.fn();
    (getLocation as jest.Mock).mockRejectedValueOnce(
      new Error("Location unavailable")
    );
    jest.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <Provider store={store}>
        <EditDevice
          formRef={mockFormRef}
          device={mockDevice}
          onUpdateCoords={mockUpdateCoords}
        />
      </Provider>
    );

    const button = screen.getByRole("button", { name: /locPin/i });
    await userEvent.click(button);

    expect(window.alert).toHaveBeenCalledWith("Location unavailable");
    expect(mockUpdateCoords).not.toHaveBeenCalled();
  });
  test("updates inputs when a new device is passed as prop", () => {
    const { rerender } = render(
      <Provider store={store}>
        <EditDevice
          formRef={mockFormRef}
          device={mockDevice}
          onUpdateCoords={jest.fn()}
        />
      </Provider>
    );

    const newDevice = {
      ...mockDevice,
      deviceName: "New Device",
      description: "New Desc",
      deviceAddress: "New Address",
    };

    rerender(
      <Provider store={store}>
        <EditDevice
          formRef={mockFormRef}
          device={newDevice}
          onUpdateCoords={jest.fn()}
        />
      </Provider>
    );

    expect(screen.getByDisplayValue(newDevice.deviceName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(newDevice.description)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(newDevice.deviceAddress)
    ).toBeInTheDocument();
  });
  test("adds btnAddActive class correctly", async () => {
    render(
      <Provider store={store}>
        <EditDevice
          formRef={mockFormRef}
          device={mockDevice}
          onUpdateCoords={jest.fn()}
        />
      </Provider>
    );

    const jsonButton = screen.getByRole("button", { name: /JSON Value/i });
    const singleButton = screen.getByRole("button", { name: /Single Value/i });

    expect(jsonButton).toHaveClass("btnAddActive");
    expect(singleButton).not.toHaveClass("btnAddActive");

    await userEvent.click(singleButton);
    expect(singleButton).toHaveClass("btnAddActive");
    expect(jsonButton).not.toHaveClass("btnAddActive");
  });
});
