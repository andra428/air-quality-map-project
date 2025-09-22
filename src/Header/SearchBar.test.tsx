import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchBar from "./SearchBar";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

const preloadedState = {
  auth: { currentUser: null },
  device: { devices: [] },
};

const mockAuthReducer = (state = preloadedState.auth, _action: any) => state;
const mockDevicesReducer = (state = preloadedState.device, _action: any) =>
  state;

const testReducer = combineReducers({
  auth: mockAuthReducer,
  device: mockDevicesReducer,
});

describe("SearchBar component", () => {
  let store: any;
  beforeEach(() => {
    store = configureStore({
      reducer: testReducer,
    });
  });
  test("SearchBar should have an search image", () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );
    const searchLogo = screen.getByAltText("search");
    expect(searchLogo).toBeInTheDocument();
    expect(searchLogo).toHaveClass("svg");
    expect(searchLogo).toHaveAttribute("src");
    expect(searchLogo.getAttribute("src")).not.toBe("");
  });
  test("SearchBar should have an loop image", () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );
    const loopLogo = screen.getByAltText("loop");

    expect(loopLogo).toBeInTheDocument();
    expect(loopLogo).toHaveClass("svg2");
    expect(loopLogo).toHaveAttribute("src");
    expect(loopLogo.getAttribute("src")).not.toBe("");
  });
  test("It should have a text input", () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );
    const textElement = screen.getByRole("textbox");
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveClass("input");
  });
  test("The text input should have a placeholder", () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );
    const inputElement = screen.getByPlaceholderText("Type address...");
    expect(inputElement).toBeInTheDocument();
  });
  test("The search bar should not show any devices if a user is not logged in", () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );
    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "mac" } });

    const searchList = screen.queryByRole("list");
    expect(searchList).not.toBeInTheDocument();
  });
  test("The search bar should show the devices in a list if a user is logged in", () => {
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
    };
    const testStore = configureStore({
      reducer: combineReducers({
        auth: (state = preloadedStateWithUser.auth) => state,
        device: (state = preloadedStateWithUser.device) => state,
      }),
    });
    render(
      <Provider store={testStore}>
        <SearchBar />
      </Provider>
    );
    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "mac" } });

    const searchList = screen.queryByRole("list");
    expect(searchList).toBeInTheDocument();
  });
});
