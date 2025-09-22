import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AddDevice from "./AddDevice";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import { saveUserData } from "./CollectionOperations";
import { RefObject } from "react";
import { getCoordsFromAddress, getLocation } from "./Location";

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

const mockFormRef: RefObject<HTMLFormElement> = {
  current: document.createElement("form"),
};
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
  test("Add Device component should display the metrics components (initial value)", () => {
    render(
      <Provider store={store}>
        <AddDevice formRef={mockFormRef} />
      </Provider>
    );
    expect(screen.getByText("Metrics to be tracked")).toBeInTheDocument();
    expect(screen.getByText("Public metrics")).toBeInTheDocument();
  });
  test("Add Device component should not display the metrics components (changed type value)", async () => {
    render(
      <Provider store={store}>
        <AddDevice formRef={mockFormRef} />
      </Provider>
    );
    const changeStateButton = screen.getByRole("button", {
      name: /Single Value/i,
    });
    await userEvent.click(changeStateButton);
    expect(screen.queryByText("Metrics to be tracked")).not.toBeInTheDocument();
    expect(screen.queryByText("Public metrics")).not.toBeInTheDocument();
  });
  test("Add Device component should display the metrics components if the user clicks the JSON button (changed type value)", async () => {
    render(
      <Provider store={store}>
        <AddDevice formRef={mockFormRef} />
      </Provider>
    );
    const changeStateButton = screen.getByRole("button", {
      name: /JSON Value/i,
    });
    await userEvent.click(changeStateButton);
    expect(screen.getByText("Metrics to be tracked")).toBeInTheDocument();
    expect(screen.getByText("Public metrics")).toBeInTheDocument();
  });
  test("Add Device component should show alert if required fields are missing", async () => {
    window.alert = jest.fn();

    render(
      <Provider store={store}>
        <AddDevice formRef={mockFormRef} />
      </Provider>
    );

    mockFormRef.current = document.querySelector("form") as HTMLFormElement;
    fireEvent.submit(mockFormRef.current);

    expect(window.alert).toHaveBeenCalledWith(
      "Device name, description and location need to be filled"
    );
  });
  test("Add Device component should submit with all the data via formRef event", async () => {
    (saveUserData as jest.Mock).mockResolvedValue(1);
    (getCoordsFromAddress as jest.Mock).mockResolvedValue([
      {
        address: "Cluj",
        coords: { lat: 46.77, long: 23.59 },
      },
    ]);
    render(
      <Provider store={store}>
        <AddDevice formRef={mockFormRef} />
      </Provider>
    );

    await userEvent.type(screen.getByPlaceholderText(/Type name/i), "Device X");
    await userEvent.type(
      screen.getByPlaceholderText(/Type description/i),
      "Some Desc"
    );
    await userEvent.type(screen.getByPlaceholderText(/Location/i), "Cluj");

    const resultItem = await screen.findByText("Cluj");
    await userEvent.click(resultItem);

    mockFormRef.current = document.querySelector("form") as HTMLFormElement;
    mockFormRef.current.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
    expect(saveUserData).toHaveBeenCalled();
    expect(saveUserData).toHaveBeenCalledWith(
      expect.objectContaining({
        deviceLat: 46.77,
        deviceLong: 23.59,
        deviceAddress: "Cluj",
      })
    );
  });
  test("Add Device component should update location and coords when clicking pin button", async () => {
    (getLocation as jest.Mock).mockResolvedValue({
      address: "Iași",
      coords: { lat: 47.15, long: 27.6 },
    });

    render(
      <Provider store={store}>
        <AddDevice formRef={mockFormRef} />
      </Provider>
    );

    const pinButton = screen.getByRole("button", { name: /locPin/i });
    await userEvent.click(pinButton);

    expect(screen.getByPlaceholderText(/Location/i)).toHaveValue("Iași");
  });
  test("Add Device component should dispatch error modal if saveUserData fails", async () => {
    (saveUserData as jest.Mock).mockRejectedValue(new Error("fail"));
    (getCoordsFromAddress as jest.Mock).mockResolvedValue([
      { address: "Cluj", coords: { lat: 46.77, long: 23.59 } },
    ]);

    render(
      <Provider store={store}>
        <AddDevice formRef={mockFormRef} />
      </Provider>
    );

    await userEvent.type(screen.getByPlaceholderText(/Type name/i), "Device X");
    await userEvent.type(
      screen.getByPlaceholderText(/Type description/i),
      "Some Desc"
    );
    await userEvent.type(screen.getByPlaceholderText(/Location/i), "Cluj");

    const resultItem = await screen.findByText("Cluj");
    await userEvent.click(resultItem);
    mockFormRef.current = document.querySelector("form") as HTMLFormElement;
    fireEvent.submit(mockFormRef.current);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            text: "Oops! The device wasn't added. Try again.",
            type: "error",
          }),
        })
      );
    });
  });

  test("Add Device component should send correct location to saveUserData when clicking pin button", async () => {
    (getLocation as jest.Mock).mockResolvedValue({
      address: "Iași",
      coords: { lat: 47.15, long: 27.6 },
    });
    (saveUserData as jest.Mock).mockResolvedValue(1);

    render(
      <Provider store={store}>
        <AddDevice formRef={mockFormRef} />
      </Provider>
    );

    const pinButton = screen.getByRole("button", { name: /locPin/i });
    await userEvent.click(pinButton);

    expect(screen.getByPlaceholderText(/Location/i)).toHaveValue("Iași");

    await userEvent.type(screen.getByPlaceholderText(/Type name/i), "Device X");
    await userEvent.type(
      screen.getByPlaceholderText(/Type description/i),
      "Some Desc"
    );

    mockFormRef.current = document.querySelector("form") as HTMLFormElement;
    fireEvent.submit(mockFormRef.current);

    expect(saveUserData).toHaveBeenCalledWith(
      expect.objectContaining({
        deviceLat: 47.15,
        deviceLong: 27.6,
        deviceAddress: "Iași",
        deviceName: "Device X",
        description: "Some Desc",
      })
    );
    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            text: "Success! The device was added.",
            type: "success",
          }),
        })
      );
    });
  });
  test("Add Device component typing location triggers getCoordsFromAddress and updates selectedLocation", async () => {
    (getCoordsFromAddress as jest.Mock).mockResolvedValue([
      { address: "Cluj", coords: { lat: 46.77, long: 23.59 } },
    ]);

    render(
      <Provider store={store}>
        <AddDevice formRef={mockFormRef} />
      </Provider>
    );

    await userEvent.type(screen.getByPlaceholderText(/Location/i), "Clu");
    const resultItem = await screen.findByText("Cluj");
    expect(resultItem).toBeInTheDocument();
  });
});
