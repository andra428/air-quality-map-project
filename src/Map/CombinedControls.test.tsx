import { render } from "@testing-library/react";
import CombinedControls from "./CombinedControls";
import * as leaflet from "leaflet";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

const mockLatLng = { lat: 44.787197, lng: 20.457273 };
const mockMap = {
  addControl: jest.fn(),
  removeControl: jest.fn(),
  locate: jest.fn(),
  zoomIn: jest.fn(),
  zoomOut: jest.fn(),
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
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("leaflet", () => {
  const actualLeaflet = jest.requireActual("leaflet");

  return {
    ...actualLeaflet,
    Control: {
      extend: jest.fn().mockImplementation((def) => {
        return function () {
          return def;
        };
      }),
    },
    DomUtil: {
      create: jest.fn((tag, className, parent?) => {
        const el = document.createElement(tag);
        if (className) {
          el.className = className;
        }
        if (parent) {
          parent.appendChild(el);
        }
        return el;
      }),
    },
    DomEvent: {
      on: jest.fn((el, event, handler) => {
        el.addEventListener(event, handler);

        return {
          on: (el2: any, evt2: string, h2: any) => {
            el2.addEventListener(evt2, h2);
            return this;
          },
        };
      }),
      stop: jest.fn(),
      disableClickPropagation: jest.fn(),
    },
    marker: jest.fn(() => ({
      addTo: jest.fn().mockReturnThis(),
      bindPopup: jest.fn().mockReturnThis(),
      openPopup: jest.fn().mockReturnThis(),
      remove: jest.fn(),
    })),
  };
});

const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
};
Object.defineProperty(global.navigator, "geolocation", {
  value: mockGeolocation,
  writable: true,
});

describe("CombinedControls componenent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("CombinedControls componenent should render and add the control to the map", () => {
    render(<CombinedControls />);
    expect(leaflet.Control.extend).toHaveBeenCalledTimes(1);
    expect(mockMap.addControl).toHaveBeenCalledTimes(1);
  });

  test("CombinedControls componenent onAdd function should build DOM with zoom and location buttons", () => {
    render(<CombinedControls />);

    const control = mockMap.addControl.mock.calls[0][0];

    const container = control.onAdd(mockMap);
    document.body.appendChild(container);
    const zoomInBtn = container.querySelector(".leaflet-control-zoom-in");
    expect(zoomInBtn).toBeInTheDocument();
    const zoomOutBtn = container.querySelector(".leaflet-control-zoom-out");
    expect(zoomOutBtn).toBeInTheDocument();
    const curPosBtn = container.querySelector(".btn-currPos");
    expect(curPosBtn).toBeInTheDocument();
  });

  test("CombinedControls componenent should zoom-in when the button calls map.zoomIn()", async () => {
    render(<CombinedControls />);

    const control = mockMap.addControl.mock.calls[0][0];
    const container = control.onAdd(mockMap);
    document.body.appendChild(container);

    const zoomInBtn = container.querySelector(".leaflet-control-zoom-in");
    expect(zoomInBtn).toBeInTheDocument();
    await userEvent.click(zoomInBtn);

    expect(mockMap.zoomIn).toHaveBeenCalledTimes(1);
  });
  test("CombinedControls componenent should zoom-out when the button calls map.zoomOut()", async () => {
    render(<CombinedControls />);

    const control = mockMap.addControl.mock.calls[0][0];
    const container = control.onAdd(mockMap);
    document.body.appendChild(container);

    const zoomOutBtn = container.querySelector(".leaflet-control-zoom-out");
    expect(zoomOutBtn).toBeInTheDocument();
    await userEvent.click(zoomOutBtn);

    expect(mockMap.zoomOut).toHaveBeenCalledTimes(1);
  });
  test("CombinedControls componenent current-location button should move the map and to add a marker", async () => {
    render(<CombinedControls />);

    const control = mockMap.addControl.mock.calls[0][0];
    const container = control.onAdd(mockMap);
    document.body.appendChild(container);

    const curPosBtn = container.querySelector(".btn-currPos")!;
    await userEvent.click(curPosBtn);

    expect(mockMap.locate).toHaveBeenCalledTimes(1);

    expect(leaflet.marker).toHaveBeenCalledWith(mockLatLng);

    expect(mockMap.flyTo).toHaveBeenCalledWith(mockLatLng, 13);
  });
});
