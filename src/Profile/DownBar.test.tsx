import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import DownBar from "./DownBar";
import * as uiSlice from "../Auth/uiSlice";

const preloadedState = {
  auth: { currentUser: null },
  ui: { isSettingsModalOpen: false, isProfilePageModalOpen: false },
};

const mockAuthReducer = (state = preloadedState.auth, _action: any) => state;
const mockUiReducer = (state = preloadedState.ui, _action: any) => state;

const testReducer = combineReducers({
  auth: mockAuthReducer,
  ui: mockUiReducer,
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
  ui: { isSettingsModalOpen: false, isProfilePageModalOpen: false },
};

const mockAuthReducerWithUser = (
  state = preloadedStateWithUser.auth,
  _action: any
) => state;

const mockUiReducerWithUser = (
  state = preloadedStateWithUser.ui,
  _action: any
) => state;

const testReducerWithUser = combineReducers({
  auth: mockAuthReducerWithUser,
  ui: mockUiReducerWithUser,
});
describe("DownBar Componenent", () => {
  let store: any;
  let dispatchSpy: jest.SpyInstance;
  beforeEach(() => {
    store = configureStore({
      reducer: testReducer,
      preloadedState: preloadedState,
    });
    dispatchSpy = jest.spyOn(store, "dispatch");
  });
  test("DownBar componenent should open the Settings componenent if the user is not logged in", async () => {
    render(
      <Provider store={store}>
        <DownBar />
      </Provider>
    );
    const settingsButton = screen.getByRole("button", { name: "settings" });
    await userEvent.click(settingsButton);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(uiSlice.openSettingsModal());
  });
  test("DownBar componenent should open the Profile componenent if the user is logged in", async () => {
    store = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
    dispatchSpy = jest.spyOn(store, "dispatch");
    render(
      <Provider store={store}>
        <DownBar />
      </Provider>
    );
    const settingsButton = screen.getByRole("button", { name: "settings" });
    await userEvent.click(settingsButton);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(uiSlice.openProfilePageModal());
  });
  test("DownBar should have the correct CSS classes applied", () => {
    render(
      <Provider store={store}>
        <DownBar />
      </Provider>
    );
    const settingsButton = screen.getByRole("button", { name: "settings" });
    const outerContainer = settingsButton.parentElement;
    expect(outerContainer).toHaveClass("downBarContainer");
    expect(settingsButton).toHaveClass("btnDownBarContainer");
  });
});
