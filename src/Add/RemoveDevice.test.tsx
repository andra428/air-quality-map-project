import { combineReducers, configureStore } from "@reduxjs/toolkit";
import RemoveDevice from "./RemoveDevice";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import * as CollectionOperations from "./CollectionOperations";
import userEvent from "@testing-library/user-event";
import uiReducer, {
  closeEditPage,
  closeRemoveDevicePage,
  openMessagePageModal,
  openProfilePageModal,
} from "../Auth/uiSlice";
import { setDevices } from "../Auth/deviceSlice";
import deviceReducer from "../Auth/deviceSlice";
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
    isRemoveDevicePageOpen: true,

    isAddNewPageModalOpen: false,
    isMessagePageOpen: false,

    editingDeviceId: null,
    messageText: null,
    messageType: null,

    isMetricsPageOpen: false,
    metricsDeviceId: null,
    lastDeviceId: null,
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

const testReducerWithUser = combineReducers({
  auth: mockAuthReducerWithUser,
  ui: uiReducer,
  device: deviceReducer,
});

jest.mock("./CollectionOperations", () => ({
  saveUserData: jest.fn(),
  deleteDocument: jest.fn(),
  getDocuments: jest.fn(),
}));

describe("Remove Device component", () => {
  let store: any;
  let dispatchSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
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
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
  test("renders the buttons correctly", () => {
    render(
      <Provider store={store}>
        <RemoveDevice onClose={jest.fn()} device={mockDevice} />
      </Provider>
    );
    const yesBtn = screen.getByRole("button", { name: "Yes" });
    const noBtn = screen.getByRole("button", { name: "No" });
    expect(yesBtn).toBeInTheDocument();
    expect(noBtn).toBeInTheDocument();
  });
  test("renders confirmation message with device name", () => {
    render(
      <Provider store={store}>
        <RemoveDevice onClose={jest.fn()} device={mockDevice} />
      </Provider>
    );
    expect(
      screen.getByText(
        /Are you sure you want to delete the Galaxy S8 device\?/i
      )
    ).toBeInTheDocument();
  });
  test("calls deleteDocument and updates devices on confirm", async () => {
    jest
      .spyOn(CollectionOperations, "deleteDocument")
      .mockResolvedValue(undefined);
    jest.spyOn(CollectionOperations, "getDocuments").mockResolvedValue([
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
    ]);

    render(
      <Provider store={store}>
        <RemoveDevice onClose={jest.fn()} device={mockDevice} />
      </Provider>
    );

    await userEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(CollectionOperations.deleteDocument).toHaveBeenCalledWith("3");
      expect(CollectionOperations.getDocuments).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenNthCalledWith(1, closeEditPage());
      expect(dispatchSpy).toHaveBeenNthCalledWith(2, closeRemoveDevicePage());
      expect(dispatchSpy).toHaveBeenNthCalledWith(3, openProfilePageModal());
      expect(dispatchSpy).toHaveBeenNthCalledWith(
        4,
        openMessagePageModal({
          text: "Success! The device was removed.",
          type: "success",
        })
      );
      expect(dispatchSpy).toHaveBeenNthCalledWith(
        5,
        setDevices(
          expect.arrayContaining([
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
          ])
        )
      );
      const state = store.getState();
      expect(state.device.devices).toHaveLength(2);

      expect(state.ui.isRemoveDevicePageOpen).toBe(false);
      expect(state.ui.isEditPageOpen).toBe(false);
      expect(state.ui.isMessagePageOpen).toBe(true);
      expect(state.ui.messageText).toBe("Success! The device was removed.");
      expect(state.ui.messageType).toBe("success");
      expect(state.device.devices).toEqual([
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
      ]);
    });
  });
  test("calls deleteDocument and getDocuments on confirm", async () => {
    jest
      .spyOn(CollectionOperations, "deleteDocument")
      .mockResolvedValue(undefined);
    jest.spyOn(CollectionOperations, "getDocuments").mockResolvedValue([]);

    render(
      <Provider store={store}>
        <RemoveDevice onClose={jest.fn()} device={mockDevice} />
      </Provider>
    );
    await userEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(CollectionOperations.deleteDocument).toHaveBeenCalledWith("3");
      expect(CollectionOperations.getDocuments).toHaveBeenCalled();
    });
  });
  test("dispatches UI actions in correct order on confirm", async () => {
    render(
      <Provider store={store}>
        <RemoveDevice onClose={jest.fn()} device={mockDevice} />
      </Provider>
    );
    await userEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenNthCalledWith(1, closeEditPage());
      expect(dispatchSpy).toHaveBeenNthCalledWith(2, closeRemoveDevicePage());
      expect(dispatchSpy).toHaveBeenNthCalledWith(3, openProfilePageModal());
      expect(dispatchSpy).toHaveBeenNthCalledWith(
        4,
        openMessagePageModal({
          text: "Success! The device was removed.",
          type: "success",
        })
      );
    });
  });
  test("shows error message if deletion fails", async () => {
    jest
      .spyOn(CollectionOperations, "deleteDocument")
      .mockRejectedValue(new Error("fail"));

    render(
      <Provider store={store}>
        <RemoveDevice onClose={jest.fn()} device={mockDevice} />
      </Provider>
    );

    await userEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      const state = store.getState();
      expect(state.ui.isMessagePageOpen).toBe(true);
      expect(state.ui.messageText).toBe(
        "Oops! The device could not be removed."
      );
      expect(state.ui.messageType).toBe("error");
    });
  });
  test("calls onClose when clicking No", async () => {
    const onClose = jest.fn();
    render(
      <Provider store={store}>
        <RemoveDevice onClose={onClose} device={mockDevice} />
      </Provider>
    );
    await userEvent.click(screen.getByText("No"));
    expect(onClose).toHaveBeenCalled();
  });
});
