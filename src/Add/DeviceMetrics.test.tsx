import { combineReducers, configureStore } from "@reduxjs/toolkit";
import uiReducer, {
  closeMetricsPage,
  closeProfilePageModal,
  openEditPage,
  openProfilePageModal,
  openRemoveDevicePage,
} from "../Auth/uiSlice";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { DeviceData } from "../Auth/deviceSlice";
import DeviceMetrics from "./DeviceMetrics";
import { useIsMobile } from "../hooks/useMediaQuery";
import userEvent from "@testing-library/user-event";

jest.mock("../hooks/useMediaQuery", () => ({
  useIsMobile: jest.fn(),
}));

const mockedUseIsMobile = useIsMobile as jest.Mock<boolean>;
jest.mock("./HourMetrics", () => {
  return ({ type }: any) => (
    <div data-testid="hour-metrics">HourMetrics {type}</div>
  );
});

jest.mock("./DayMetrics", () => {
  return ({ type, timeType }: any) => (
    <div data-testid="day-metrics">
      DayMetrics {type} {timeType}
    </div>
  );
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
    isRemoveDevicePageOpen: false,
    isAddNewPageModalOpen: false,
    isMessagePageOpen: false,
    editingDeviceId: null,
    messageText: null,
    messageType: null,
    isMetricsPageOpen: true,
    metricsDeviceId: "3",
    lastDeviceId: null,
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

describe("Devices component", () => {
  let store: any;
  let dispatchSpy: jest.SpyInstance;
  beforeEach(() => {
    store = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
    dispatchSpy = jest.spyOn(store, "dispatch");
    jest
      .spyOn(require("../hooks/useAppDispatch"), "useAppDispatch")
      .mockReturnValue(dispatchSpy);
  });
  test("renders one of the devices of the current user (desktop)", () => {
    mockedUseIsMobile.mockReturnValue(false);
    render(
      <Provider store={store}>
        <DeviceMetrics onClose={jest.fn()} />
      </Provider>
    );

    const state = store.getState();
    const currentUserId = state.auth.currentUser.uid;
    const userDevices = state.device.devices.filter(
      (d: DeviceData) => d.userId === currentUserId
    );
    const currentDevice = userDevices.find(
      (d: DeviceData) => d.id === state.ui.metricsDeviceId
    );
    const imgBack = screen.getByAltText("x");
    expect(imgBack).toBeInTheDocument();
    expect(screen.getByText(currentDevice.deviceName)).toBeInTheDocument();
    expect(screen.getByText(currentDevice.deviceAddress)).toBeInTheDocument();
  });
  test("renders one of the devices of the current user (mobile)", () => {
    mockedUseIsMobile.mockReturnValue(true);
    render(
      <Provider store={store}>
        <DeviceMetrics onClose={jest.fn()} />
      </Provider>
    );

    const state = store.getState();

    const currentDevice = state.device.devices.find(
      (d: DeviceData) => d.id === state.ui.metricsDeviceId
    );
    const imgBack = screen.getByAltText("back");
    expect(imgBack).toBeInTheDocument();
    expect(screen.getByText(currentDevice.deviceName)).toBeInTheDocument();
    expect(screen.getByText(currentDevice.deviceAddress)).toBeInTheDocument();
  });
  test("renders one of the devices of the current user & edit button & remove button is present (desktop)", () => {
    mockedUseIsMobile.mockReturnValue(false);
    render(
      <Provider store={store}>
        <DeviceMetrics onClose={jest.fn()} />
      </Provider>
    );

    const state = store.getState();

    const currentDevice = state.device.devices.find(
      (d: DeviceData) => d.id === state.ui.metricsDeviceId
    );
    const imgBack = screen.getByAltText("x");
    const editBtn = screen.getByRole("button", { name: /edit/i });
    expect(editBtn).toBeInTheDocument();
    const removeBtn = screen.getByRole("button", { name: /remove device/i });
    expect(removeBtn).toBeInTheDocument();
    expect(imgBack).toBeInTheDocument();
    expect(screen.getByText(currentDevice.deviceName)).toBeInTheDocument();
    expect(screen.getByText(currentDevice.deviceAddress)).toBeInTheDocument();
  });
  test("renders a device not of the current user & edit button is not present (desktop)", () => {
    mockedUseIsMobile.mockReturnValue(false);
    const preloadedStateWithMetrics = {
      ...preloadedStateWithUser,
      ui: {
        ...preloadedStateWithUser.ui,
        metricsDeviceId: "4",
      },
    };

    const storeMetrics = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithMetrics,
    });
    render(
      <Provider store={storeMetrics}>
        <DeviceMetrics onClose={jest.fn()} />
      </Provider>
    );

    const state = storeMetrics.getState();

    const currentDevice = state.device.devices.find(
      (d: DeviceData) => d.id === state.ui.metricsDeviceId
    );
    const imgBack = screen.getByAltText("x");
    const editBtn = screen.queryByRole("button", { name: /edit/i });
    expect(editBtn).not.toBeInTheDocument();
    expect(imgBack).toBeInTheDocument();
    expect(screen.getByText(currentDevice!.deviceName)).toBeInTheDocument();
    expect(screen.getByText(currentDevice!.deviceAddress)).toBeInTheDocument();
  });
  test("handleEditPage dispatches correct actions", async () => {
    mockedUseIsMobile.mockReturnValue(false);
    const preloadedStateWithMetrics = {
      ...preloadedStateWithUser,
      ui: {
        ...preloadedStateWithUser.ui,
        metricsDeviceId: "3",
      },
    };

    const storeMetrics = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithMetrics,
    });
    render(
      <Provider store={storeMetrics}>
        <DeviceMetrics onClose={jest.fn()} />
      </Provider>
    );
    const state = storeMetrics.getState();

    const currentDevice = state.device.devices.find(
      (d: DeviceData) => d.id === state.ui.metricsDeviceId
    );
    const editBtn = screen.getByText(/edit/i).closest("button")!;
    await userEvent.click(editBtn);

    expect(dispatchSpy).toHaveBeenCalledWith(closeProfilePageModal());
    expect(dispatchSpy).toHaveBeenCalledWith(closeMetricsPage());
    expect(dispatchSpy).toHaveBeenCalledWith(openEditPage(currentDevice!.id));
  });
  test("handleRemove dispatches correct actions", async () => {
    mockedUseIsMobile.mockReturnValue(false);
    const preloadedStateWithMetrics = {
      ...preloadedStateWithUser,
      ui: {
        ...preloadedStateWithUser.ui,
        metricsDeviceId: "3",
      },
    };

    const storeMetrics = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithMetrics,
    });
    render(
      <Provider store={storeMetrics}>
        <DeviceMetrics onClose={jest.fn()} />
      </Provider>
    );

    const editBtn = screen.getByRole("button", { name: /remove device/i });
    await userEvent.click(editBtn);
    expect(dispatchSpy).toHaveBeenCalledWith(openRemoveDevicePage());
  });
  test("handleBackButton dispatches correct actions when the selected device is owned by the current user (mobile)", async () => {
    mockedUseIsMobile.mockReturnValue(true);

    const preloadedStateWithMetrics = {
      ...preloadedStateWithUser,
      ui: {
        ...preloadedStateWithUser.ui,
        metricsDeviceId: "3",
      },
    };

    const storeMetrics = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithMetrics,
    });
    render(
      <Provider store={storeMetrics}>
        <DeviceMetrics onClose={jest.fn()} />
      </Provider>
    );

    const editBtn = screen.getByAltText("back").closest("button")!;
    await userEvent.click(editBtn);

    expect(dispatchSpy).toHaveBeenCalledWith(closeMetricsPage());
    expect(dispatchSpy).toHaveBeenCalledWith(openProfilePageModal());
  });
  test("handleBackButton dispatches correct actions when the selected device is not owned by the current user (mobile)", async () => {
    mockedUseIsMobile.mockReturnValue(true);

    const preloadedStateWithMetrics = {
      ...preloadedStateWithUser,
      ui: {
        ...preloadedStateWithUser.ui,
        metricsDeviceId: "4",
      },
    };

    const storeMetrics = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithMetrics,
    });
    render(
      <Provider store={storeMetrics}>
        <DeviceMetrics onClose={jest.fn()} />
      </Provider>
    );

    const editBtn = screen.getByAltText("back").closest("button")!;
    await userEvent.click(editBtn);

    expect(dispatchSpy).toHaveBeenCalledWith(closeMetricsPage());
    expect(dispatchSpy).not.toHaveBeenCalledWith(openProfilePageModal());
  });
  test("calls onClose when close button is clicked (desktop)", async () => {
    mockedUseIsMobile.mockReturnValue(false);
    const onCloseMock = jest.fn();
    render(
      <Provider store={store}>
        <DeviceMetrics onClose={onCloseMock} />
      </Provider>
    );

    const closeBtn = screen.getByAltText("x").closest("button")!;
    await userEvent.click(closeBtn);

    expect(onCloseMock).toHaveBeenCalled();
  });
  test("renders HourMetrics and DayMetrics correctly based on timeType", async () => {
    render(
      <Provider store={store}>
        <DeviceMetrics onClose={jest.fn()} />
      </Provider>
    );

    expect(screen.getAllByTestId("hour-metrics").length).toBeGreaterThan(0);

    const todayBtn = screen.getByRole("button", { name: /today/i });
    await userEvent.click(todayBtn);

    expect(screen.getAllByTestId("day-metrics").length).toBeGreaterThan(0);
    const hourBtn = screen.getByRole("button", { name: /hour/i });
    await userEvent.click(hourBtn);
    expect(screen.getAllByTestId("hour-metrics").length).toBeGreaterThan(0);
  });
});
