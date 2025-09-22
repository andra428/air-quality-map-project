import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Map from "./Map";
import CombinedControls from "./CombinedControls";
import LogoControl from "./LogoControl";
import { ReactNode } from "react";
import { useIsMobile } from "../hooks/useMediaQuery";
import PositionControl from "./PositionControl";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import metricsReducer from "../Auth/metricsSlice";
jest.mock("../hooks/useMediaQuery", () => ({
  useIsMobile: jest.fn(),
}));
const mockedUseIsMobile = useIsMobile as jest.Mock<boolean>;

const preloadedState = {
  auth: { currentUser: null },
  device: { devices: [] },
  ui: {
    isSettingsModalOpen: false,
    isProfilePageModalOpen: false,
    isEditPageOpen: false,
  },
};

const mockAuthReducer = (state = preloadedState.auth, _action: any) => state;
const mockUiReducer = (state = preloadedState.ui, _action: any) => state;
const mockDevicesReducer = (state = preloadedState.device, _action: any) =>
  state;

const testReducer = combineReducers({
  auth: mockAuthReducer,
  ui: mockUiReducer,
  device: mockDevicesReducer,
});
const selectedDevice1 = {
  id: 3,
  description: "Samsung",
  deviceAddress: "Bulevardul Chimiei, Iași, Romania",
  deviceLat: 47.15298272334212,
  deviceLong: 27.607666009413876,
  deviceName: "Galaxy S8",
  userEmail: "alupu@griddynamics.com",
  userId: "GW7cGeR2aJcc8RJvhZXcbWu7Fwk2",
  userName: "Andra Maria Lupu",
};
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
    selectedDevice: selectedDevice1,
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
  metrics: metricsReducer,
});

const mockLatLng = { lat: 44.787197, lng: 20.457273 };
const mockMap = {
  addControl: jest.fn(),
  removeControl: jest.fn(),
  locate: jest.fn(),
  zoomIn: jest.fn(),
  zoomOut: jest.fn(),
  setView: jest.fn(),
  flyTo: jest.fn(),
  removeLayer: jest.fn(),
  once: jest.fn((event, callback) => {
    if (event === "locationfound") {
      callback({
        latlng: mockLatLng,
      });
    }
  }),
};

jest.mock("react-leaflet", () => ({
  useMap: () => mockMap,
  useMapEvents: () => ({}),
  MapContainer: ({ children, ref }: { children: ReactNode; ref?: any }) => {
    if (ref) {
      if (typeof ref === "function") {
        ref(mockMap);
      } else {
        ref.current = mockMap;
      }
    }
    return <div>{children}</div>;
  },

  TileLayer: () => <div data-testid="tilelayer" />,
  Marker: ({ children }: { children: ReactNode }) => (
    <div data-testid="marker">{children}</div>
  ),
  Popup: ({ children }: { children: ReactNode }) => (
    <div data-testid="popup">{children}</div>
  ),
}));

describe("Map component", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: testReducer,
      preloadedState: preloadedState,
    });
  });
  test("Map component should render MapContainer with subcomponents:CombinedControls, LogoControl (desktop)", () => {
    mockedUseIsMobile.mockReturnValue(false);
    render(
      <Provider store={store}>
        <Map />
      </Provider>
    );

    const tileLayer = screen.getByTestId("tilelayer");
    expect(tileLayer).toBeInTheDocument();

    expect(CombinedControls).toBeTruthy();
    expect(LogoControl).toBeTruthy();

    expect(mockMap.addControl).toHaveBeenCalled();
  });
  test("Map component should render MapContainer with subcomponent:PositionControl (mobile)", () => {
    mockedUseIsMobile.mockReturnValue(true);
    render(
      <Provider store={store}>
        <Map />
      </Provider>
    );

    const tileLayer = screen.getByTestId("tilelayer");
    expect(tileLayer).toBeInTheDocument();
    expect(PositionControl).toBeTruthy();
  });
  test("Map component devices list should be empty and no markers rendered if a user is not logged in (desktop)", () => {
    mockedUseIsMobile.mockReturnValue(false);
    const { queryAllByTestId } = render(
      <Provider store={store}>
        <Map />
      </Provider>
    );

    const markers = queryAllByTestId("marker");
    expect(markers.length).toBe(0);
    expect(markers.length).toBe(preloadedState.device.devices.length);
    expect(queryAllByTestId("tilelayer").length).toBe(1);
    expect(mockMap.setView).toHaveBeenCalledWith([44.787197, 20.457273], 13);
  });
  test("Map component devices list should not be empty and some markers should be rendered if a user is logged in (desktop)", () => {
    mockedUseIsMobile.mockReturnValue(false);
    const storeWithUser = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
    const { queryAllByTestId } = render(
      <Provider store={storeWithUser}>
        <Map />
      </Provider>
    );

    const markers = queryAllByTestId("marker");
    expect(markers.length).toBeGreaterThan(0);
    expect(markers.length).toBe(preloadedStateWithUser.device.devices.length);
    expect(queryAllByTestId("tilelayer").length).toBe(1);
    const lastCall =
      mockMap.setView.mock.calls[mockMap.setView.mock.calls.length - 1];
    expect(lastCall[0]).not.toEqual([44.787197, 20.457273]);
  });

  test("Map component should center map on selectedDevice", () => {
    mockedUseIsMobile.mockReturnValue(false);
    const storeWithUser = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
    render(
      <Provider store={storeWithUser}>
        <Map />
      </Provider>
    );
    const markers = screen.getAllByTestId("marker");
    expect(markers.length).toBeGreaterThan(0);
    expect(markers.length).toBe(preloadedStateWithUser.device.devices.length);

    expect(mockMap.setView).toHaveBeenCalledWith(
      [selectedDevice1.deviceLat, selectedDevice1.deviceLong],
      13
    );
  });
  test("Map component should render Device component inside Popup", () => {
    mockedUseIsMobile.mockReturnValue(false);
    const storeWithUser = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
    render(
      <Provider store={storeWithUser}>
        <Map />
      </Provider>
    );

    expect(screen.getByText("Mac")).toBeInTheDocument();
  });
  test("Map component should open popup with Device component when marker clicked", () => {
    mockedUseIsMobile.mockReturnValue(false);
    const storeWithUser = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });

    render(
      <Provider store={storeWithUser}>
        <Map />
      </Provider>
    );

    const markers = screen.getAllByTestId("marker");

    markers[2].click();
    const popup = screen.getAllByTestId("popup")[2];
    expect(popup).toBeInTheDocument();
    expect(popup).toHaveTextContent(selectedDevice1.deviceName);
  });
});
