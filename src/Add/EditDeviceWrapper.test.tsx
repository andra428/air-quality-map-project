import { combineReducers, configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import EditDeviceWrapper from "./EditDeviceWrapper";
import { updateDocument } from "./CollectionOperations";
import uiReducer, {
  closeEditPage,
  openMessagePageModal,
  openMetricsPage,
  openProfilePageModal,
  openRemoveDevicePage,
} from "../Auth/uiSlice";
import { useIsMobile } from "../hooks/useMediaQuery";
import userEvent from "@testing-library/user-event";
import { updateDevice } from "../Auth/deviceSlice";
import { getLocation } from "./Location";

jest.mock("./Location", () => ({
  getLocation: jest.fn(),
}));

jest.spyOn(window, "alert").mockImplementation(() => {});

jest.mock("../hooks/useMediaQuery", () => ({
  useIsMobile: jest.fn(),
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
});

jest.mock("./CollectionOperations", () => ({
  updateDocument: jest.fn(),
}));

describe("EditDeviceWrapper component", () => {
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
  test("renders the selected device name and address", () => {
    mockedUseIsMobile.mockReturnValue(false);
    render(
      <Provider store={store}>
        <EditDeviceWrapper onClose={jest.fn()} />
      </Provider>
    );

    expect(screen.getByText("Galaxy S8")).toBeInTheDocument();
    expect(
      screen.getByText("Bulevardul Chimiei, Iași, Romania")
    ).toBeInTheDocument();
  });
  test("renders mobile view correctly when isMobile is true", () => {
    mockedUseIsMobile.mockReturnValue(true);

    render(
      <Provider store={store}>
        <EditDeviceWrapper onClose={jest.fn()} />
      </Provider>
    );

    expect(screen.getByText("Galaxy S8")).toBeInTheDocument();
    expect(
      screen.getByText("Bulevardul Chimiei, Iași, Romania")
    ).toBeInTheDocument();

    const imgBack = screen.getByAltText("back");
    expect(imgBack).toBeInTheDocument();
  });
  test("renders desktop view correctly when isMobile is false", () => {
    mockedUseIsMobile.mockReturnValue(false);

    render(
      <Provider store={store}>
        <EditDeviceWrapper onClose={jest.fn()} />
      </Provider>
    );

    expect(screen.getByText("Galaxy S8")).toBeInTheDocument();
    expect(
      screen.getByText("Bulevardul Chimiei, Iași, Romania")
    ).toBeInTheDocument();

    const imgBack = screen.getByAltText("x");
    expect(imgBack).toBeInTheDocument();
  });
  test("calls onClose when desktop close button is clicked", async () => {
    mockedUseIsMobile.mockReturnValue(false);
    const mockClose = jest.fn();

    render(
      <Provider store={store}>
        <EditDeviceWrapper onClose={mockClose} />
      </Provider>
    );

    expect(screen.getByText("Galaxy S8")).toBeInTheDocument();
    expect(
      screen.getByText("Bulevardul Chimiei, Iași, Romania")
    ).toBeInTheDocument();

    const imgBack = screen.getByAltText("x");
    expect(imgBack).toBeInTheDocument();
    const closeButton = screen.getByRole("button", { name: "x" });
    await userEvent.click(closeButton);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });
  test("calls handleBackButton on the mobile view and dispatches correct actions when the user opens the edit page of a device from the profile page", async () => {
    mockedUseIsMobile.mockReturnValue(true);
    const store = configureStore({
      reducer: testReducerWithUser,
      preloadedState: {
        ...preloadedStateWithUser,
        ui: {
          ...preloadedStateWithUser.ui,
          lastDeviceId: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <EditDeviceWrapper onClose={jest.fn()} />
      </Provider>
    );

    const closeButton = screen.getByRole("button", { name: "back" });
    await userEvent.click(closeButton);

    expect(dispatchSpy).toHaveBeenCalledWith(closeEditPage());
    expect(dispatchSpy).toHaveBeenCalledWith(openProfilePageModal());
  });
  test("calls handleBackButton on the mobile view and dispatches correct actions when the user opens the edit page of a device from the device's metrics page", async () => {
    mockedUseIsMobile.mockReturnValue(true);
    const store = configureStore({
      reducer: testReducerWithUser,
      preloadedState: {
        ...preloadedStateWithUser,
        ui: {
          ...preloadedStateWithUser.ui,
          lastDeviceId: "3",
          editingDeviceId: "3",
        },
      },
    });

    render(
      <Provider store={store}>
        <EditDeviceWrapper onClose={jest.fn()} />
      </Provider>
    );

    const closeButton = screen.getByRole("button", { name: "back" });
    await userEvent.click(closeButton);

    expect(dispatchSpy).toHaveBeenCalledWith(closeEditPage());
    expect(dispatchSpy).toHaveBeenCalledWith(openMetricsPage("3"));
  });
  test("calls handleRemove and dispatches the correct action", async () => {
    mockedUseIsMobile.mockReturnValue(false);

    render(
      <Provider store={store}>
        <EditDeviceWrapper onClose={jest.fn()} />
      </Provider>
    );

    const removeButton = screen.getByRole("button", { name: /remove/i });
    await userEvent.click(removeButton);

    expect(dispatchSpy).toHaveBeenCalledWith(openRemoveDevicePage());
  });
  test("calls updateDocument and dispatches a success message on successful edit of the name and description of a device", async () => {
    mockedUseIsMobile.mockReturnValue(false);
    const updatedDeviceName = "My new Mac";
    const updatedDescription = "A new description";

    const mockedUpdateDocument = updateDocument as jest.MockedFunction<
      typeof updateDocument
    >;
    render(
      <Provider store={store}>
        <EditDeviceWrapper onClose={jest.fn()} />
      </Provider>
    );

    const deviceNameInput = screen.getByDisplayValue("Galaxy S8");
    const descriptionInput = screen.getByDisplayValue("Samsung");
    const editButton = screen.getByRole("button", { name: "Edit" });

    await userEvent.clear(deviceNameInput);
    await userEvent.type(deviceNameInput, updatedDeviceName);
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, updatedDescription);

    await userEvent.click(editButton);

    const expectedUpdatePayload = {
      deviceName: updatedDeviceName,
      description: updatedDescription,
    };
    expect(mockedUpdateDocument).toHaveBeenCalledWith(
      "3",
      expectedUpdatePayload
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      updateDevice({ id: "3", ...expectedUpdatePayload })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      openMessagePageModal({
        text: "Success! The device was updated.",
        type: "success",
      })
    );
  });
  test("updates location and coords when handleLocate is triggered in the EditDevice component", async () => {
    mockedUseIsMobile.mockReturnValue(false);

    (getLocation as jest.Mock).mockResolvedValue({
      address: "Strada Noua, Iași, Romania",
      coords: { lat: 50.0, long: 30.0 },
    });

    const mockedUpdateDocument = updateDocument as jest.MockedFunction<
      typeof updateDocument
    >;

    render(
      <Provider store={store}>
        <EditDeviceWrapper onClose={jest.fn()} />
      </Provider>
    );

    const locButton = screen.getByRole("button", { name: /locPin/i });
    await userEvent.click(locButton);

    const editButton = screen.getByRole("button", { name: "Edit" });
    await userEvent.click(editButton);

    expect(mockedUpdateDocument).toHaveBeenCalledWith("3", {
      deviceAddress: "Strada Noua, Iași, Romania",
      deviceLat: 50.0,
      deviceLong: 30.0,
    });
    const locationInput = screen.getByPlaceholderText("Location...");
    expect(locationInput).toHaveValue("Strada Noua, Iași, Romania");
  });
  test("shows alert if a required field is missing (deviceName)", async () => {
    mockedUseIsMobile.mockReturnValue(false);

    render(
      <Provider store={store}>
        <EditDeviceWrapper onClose={jest.fn()} />
      </Provider>
    );

    const deviceNameInput = screen.getByDisplayValue("Galaxy S8");
    await userEvent.clear(deviceNameInput);

    const editButton = screen.getByRole("button", { name: "Edit" });
    await userEvent.click(editButton);

    expect(window.alert).toHaveBeenCalledWith(
      "Device name, description and location need to be filled"
    );
  });
  test("shows alert if a required field is missing (description)", async () => {
    mockedUseIsMobile.mockReturnValue(false);

    render(
      <Provider store={store}>
        <EditDeviceWrapper onClose={jest.fn()} />
      </Provider>
    );

    const deviceNameInput = screen.getByDisplayValue("Samsung");
    await userEvent.clear(deviceNameInput);

    const editButton = screen.getByRole("button", { name: "Edit" });
    await userEvent.click(editButton);

    expect(window.alert).toHaveBeenCalledWith(
      "Device name, description and location need to be filled"
    );
  });
  test("shows alert if no changes were made", async () => {
    mockedUseIsMobile.mockReturnValue(false);

    render(
      <Provider store={store}>
        <EditDeviceWrapper onClose={jest.fn()} />
      </Provider>
    );

    const editButton = screen.getByRole("button", { name: "Edit" });
    await userEvent.click(editButton);

    expect(window.alert).toHaveBeenCalledWith("No changes were made");
  });
  test("dispatches error message when updateDocument fails", async () => {
    mockedUseIsMobile.mockReturnValue(false);

    (updateDocument as jest.Mock).mockRejectedValueOnce(new Error("fail"));

    render(
      <Provider store={store}>
        <EditDeviceWrapper onClose={jest.fn()} />
      </Provider>
    );

    const deviceNameInput = screen.getByDisplayValue("Galaxy S8");
    await userEvent.clear(deviceNameInput);
    await userEvent.type(deviceNameInput, "New name");

    const editButton = screen.getByRole("button", { name: "Edit" });
    await userEvent.click(editButton);

    expect(dispatchSpy).toHaveBeenCalledWith(
      openMessagePageModal({
        text: "Oops! The device could not be updated. Try again.",
        type: "error",
      })
    );
  });
  test("render nothing if device not found", () => {
    const storeWithoutDevice = configureStore({
      reducer: testReducerWithUser,
      preloadedState: {
        ...preloadedStateWithUser,
        ui: { ...preloadedStateWithUser.ui, editingDeviceId: "999" },
      },
    });

    const { container } = render(
      <Provider store={storeWithoutDevice}>
        <EditDeviceWrapper onClose={jest.fn()} />
      </Provider>
    );

    expect(container).toBeEmptyDOMElement();
  });
  test("calls onClose/cancel when cancel button is clicked", async () => {
    mockedUseIsMobile.mockReturnValue(false);
    const mockClose = jest.fn();

    render(
      <Provider store={store}>
        <EditDeviceWrapper onClose={mockClose} />
      </Provider>
    );

    expect(screen.getByText("Galaxy S8")).toBeInTheDocument();
    expect(
      screen.getByText("Bulevardul Chimiei, Iași, Romania")
    ).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: "Cancel" });
    await userEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
