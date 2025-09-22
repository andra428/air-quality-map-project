import { combineReducers, configureStore } from "@reduxjs/toolkit";
import devicesReducer, {
  setDevices,
  addDevice,
  updateDevice,
  setSelectedDevice,
  DeviceData,
} from "./deviceSlice";
import uiReducer from "../Auth/uiSlice";
import metricsReducer from "./metricsSlice";
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
    devices: [],
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
  metrics: {},
};

const mockAuthReducerWithUser = (
  state = preloadedStateWithUser.auth,
  _action: any
) => state;

const testReducerWithUser = combineReducers({
  auth: mockAuthReducerWithUser,
  ui: uiReducer,
  device: devicesReducer,
  metrics: metricsReducer,
});

describe("deviceSlice", () => {
  let store: any;

  const initialDevices: DeviceData[] = [
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
  ];

  beforeEach(() => {
    store = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should set devices array", () => {
    store.dispatch(setDevices(initialDevices));
    const state = store.getState().device;
    expect(state.devices).toEqual(initialDevices);
  });

  test("should add a new device", () => {
    const newDevice: DeviceData = {
      id: "5",
      userName: "Alice Smith",
      userEmail: "alice@example.com",
      userId: "user3",
      deviceName: "Tablet",
      deviceLat: 47.16,
      deviceLong: 27.606,
      deviceAddress: "Iași, Romania",
      description: "Work tablet",
    };

    store.dispatch(setDevices(initialDevices));
    store.dispatch(addDevice(newDevice));

    const state = store.getState().device;
    expect(state.devices).toHaveLength(5);
    expect(state.devices[4]).toEqual(newDevice);
  });

  test("should update an existing device", () => {
    store.dispatch(setDevices(initialDevices));

    store.dispatch(
      updateDevice({
        id: "4",
        deviceName: "Updated Device",
        description: "Updated description",
      })
    );

    const state = store.getState().device;
    expect(state.devices[3].deviceName).toBe("Updated Device");
    expect(state.devices[3].description).toBe("Updated description");
    expect(state.devices[3].userName).toBe("John Doe");
  });

  test("should not update device if id not found", () => {
    store.dispatch(setDevices(initialDevices));

    store.dispatch(updateDevice({ id: "999", deviceName: "Non-existent" }));
    const state = store.getState().device;
    expect(state.devices).toEqual(initialDevices);
  });

  test("should set selected device", () => {
    store.dispatch(setDevices(initialDevices));

    store.dispatch(setSelectedDevice(initialDevices[0]));
    let state = store.getState().device;
    expect(state.selectedDevice).toEqual(initialDevices[0]);

    store.dispatch(setSelectedDevice(null));
    state = store.getState().device;
    expect(state.selectedDevice).toBeNull();
  });
});
