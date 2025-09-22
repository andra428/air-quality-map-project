import { render } from "@testing-library/react";
import PositionControl from "./PositionControl";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import * as leaflet from "leaflet";

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

describe("PositionControl componenent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("PositionControl componenent should add control location button to the map on mount", () => {
    render(<PositionControl />);
    expect(mockMap.addControl).toHaveBeenCalled();
  });
  test("PositionControl componenent onAdd function should build DOM with current location button", () => {
    render(<PositionControl />);

    const control = mockMap.addControl.mock.calls[0][0];

    const container = control.onAdd(mockMap);
    document.body.appendChild(container);
    const curPosBtn = container.querySelector(".btn-currPos");
    expect(curPosBtn).toBeInTheDocument();
    expect(curPosBtn.title).toBe("Current Location");
    const imgPos = container.querySelector(".img-currPos");
    expect(imgPos).toBeInTheDocument();
    expect(imgPos.alt).toBe("Current Location");
  });
  test("PositionControl componenent current-location button should move the map to the user's location and to add a marker", async () => {
    render(<PositionControl />);

    const control = mockMap.addControl.mock.calls[0][0];
    const container = control.onAdd(mockMap);
    document.body.appendChild(container);

    const curPosBtn = container.querySelector(".btn-currPos")!;
    await userEvent.click(curPosBtn);

    expect(mockMap.locate).toHaveBeenCalledTimes(1);

    expect(leaflet.marker).toHaveBeenCalledWith(mockLatLng);

    expect(mockMap.flyTo).toHaveBeenCalledWith(mockLatLng, 13);
  });
  test("PositionControl should alert if geolocation is not supported by the browser", async () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: undefined,
    });

    jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<PositionControl />);
    const control = mockMap.addControl.mock.calls[0][0];
    const container = control.onAdd(mockMap);
    document.body.appendChild(container);

    const curPosBtn = container.querySelector(".btn-currPos")!;
    await userEvent.click(curPosBtn);

    expect(window.alert).toHaveBeenCalledWith(
      "Geolocation is not supported by your browser."
    );

    Object.defineProperty(global.navigator, "geolocation", {
      value: mockGeolocation,
      writable: true,
    });
  });

  test("PositionControl should alert if the Leaflet map does not work", async () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<PositionControl />);
    const control = mockMap.addControl.mock.calls[0][0];
    const container = control.onAdd(mockMap);
    document.body.appendChild(container);

    mockMap.once.mockImplementation((event, callback) => {
      if (event === "locationerror") {
        callback({ message: "Permission denied" } as any);
      }
      return mockMap;
    });

    const curPosBtn = container.querySelector(".btn-currPos")!;
    await userEvent.click(curPosBtn);

    expect(window.alert).toHaveBeenCalledWith(
      "Geolocation error: Permission denied"
    );
  });
});
