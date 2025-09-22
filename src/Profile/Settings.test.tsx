import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useIsMobile } from "../hooks/useMediaQuery";
import Settings from "./Settings";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import * as authSlice from "../Auth/authSlice";

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
  ui: { isSettingsModalOpen: false, isProfilePageModalOpen: false },
};

const mockAuthReducer = (state = preloadedState.auth, action: any) => {
  if (action.type === "auth/signInWithGoogle/fulfilled") {
    return {
      ...state,
      currentUser: action.payload,
    };
  }
  return state;
};

const mockUiReducer = (state = preloadedState.ui, _action: any) => state;

const testReducer = combineReducers({
  auth: mockAuthReducer,
  ui: mockUiReducer,
});

describe("Settings componenent", () => {
  let store: any;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    store = configureStore({
      reducer: testReducer,
      preloadedState: preloadedState,
    });
    dispatchSpy = jest.spyOn(store, "dispatch");

    jest.spyOn(authSlice, "signInWithGoogle").mockImplementation((): any => {
      return async (dispatch: any) => {
        const action = {
          type: "auth/signInWithGoogle/fulfilled",
          payload: {
            displayName: "Andra Maria Lupu",
            email: "alupu@griddynamics.com",
            uid: "GW7cGeR2aJcc8RJvhZXcbWu7Fwk2",
            photoURL: "",
          },
        };
        dispatch(action);
        return action;
      };
    });
  });
  test("Settings componenent should display the Sign In button if a user is not logged in (desktop)", () => {
    mockedUseIsMobile.mockReturnValue(false);
    const mockClose = jest.fn();
    render(
      <Provider store={store}>
        <Settings onClose={mockClose} />
      </Provider>
    );
    const signInButton = screen.getByRole("button", { name: /Sign in/i });
    expect(signInButton).toBeInTheDocument();
  });
  test("Settiings component should call onClose when clicking the close button (desktop)", async () => {
    mockedUseIsMobile.mockReturnValue(false);
    const mockClose = jest.fn();
    render(
      <Provider store={store}>
        <Settings onClose={mockClose} />
      </Provider>
    );
    const closeButton = screen.getByRole("button", { name: /x/i });
    await userEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
  test(" Settiings component should open the About modal when About button is clicked", async () => {
    const mockClose = jest.fn();
    render(
      <Provider store={store}>
        <Settings onClose={mockClose} />
      </Provider>
    );
    const aboutButton = screen.getByRole("button", {
      name: /About this aplication/i,
    });
    await userEvent.click(aboutButton);
    expect(screen.getByText(/Let us introduce the AIRO/i)).toBeInTheDocument();
  });
  test("Settings componenent should sign in the user when it clicks the Sign in button (desktop)", async () => {
    mockedUseIsMobile.mockReturnValue(false);
    const mockClose = jest.fn();

    render(
      <Provider store={store}>
        <Settings onClose={mockClose} />
      </Provider>
    );
    const signInButton = screen.getByRole("button", { name: /Sign in/i });
    await userEvent.click(signInButton);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    expect(mockClose).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(store.getState().auth.currentUser?.displayName).toBe(
        "Andra Maria Lupu"
      );
    });
  });
});
