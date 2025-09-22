import { combineReducers, configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import MessageWrapper from "./MessageWrapper";
import uiReducer, { openMessagePageModal } from "../Auth/uiSlice";
jest.useFakeTimers();
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
    isEditPageOpen: false,
    isRemoveDevicePageOpen: false,
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

describe("Message Wrapper component", () => {
  let store: any;
  let dispatchSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

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
  test("does not render Message if modal is closed", () => {
    render(
      <Provider store={store}>
        <MessageWrapper />
      </Provider>
    );
    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });
  test("renders Message when modal is open", () => {
    const uiStateWithMessage = uiReducer(
      preloadedStateWithUser.ui,
      openMessagePageModal({ text: "Hello!", type: "success" })
    );

    const storeWithMessage = configureStore({
      reducer: testReducerWithUser,
      preloadedState: {
        ...preloadedStateWithUser,
        ui: uiStateWithMessage,
      },
    });

    render(
      <Provider store={storeWithMessage}>
        <MessageWrapper />
      </Provider>
    );
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });
  test("renders Message and closes it after 3 seconds", async () => {
    const storeWithMessage = configureStore({
      reducer: testReducerWithUser,
      preloadedState: {
        ...preloadedStateWithUser,
        ui: uiReducer(
          preloadedStateWithUser.ui,
          openMessagePageModal({ text: "Hello!", type: "success" })
        ),
      },
    });
    jest
      .spyOn(require("../hooks/useAppDispatch"), "useAppDispatch")
      .mockReturnValue(storeWithMessage.dispatch);

    render(
      <Provider store={storeWithMessage}>
        <MessageWrapper />
      </Provider>
    );

    expect(screen.getByText("Hello!")).toBeInTheDocument();

    act(() => {
      jest.runAllTimers();
    });

    const state = storeWithMessage.getState();
    expect(state.ui.isMessagePageOpen).toBe(false);
    expect(state.ui.messageText).toBe(null);
    expect(state.ui.messageType).toBe(null);
  });
});
