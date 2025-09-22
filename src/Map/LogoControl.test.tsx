import { render } from "@testing-library/react";
import LogoControl from "./LogoControl";
import * as leaflet from "leaflet";
import "@testing-library/jest-dom";
const mockMap = {
  addControl: jest.fn(),
  removeControl: jest.fn(),
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
  };
});

describe("LogoControl componenent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("LogoControl componenent should add the control to the map", () => {
    render(<LogoControl />);
    expect(leaflet.Control.extend).toHaveBeenCalledTimes(1);
    expect(mockMap.addControl).toHaveBeenCalledTimes(1);
  });

  test("LogoControl componenent onAdd should build DOM with the logo image and text", () => {
    render(<LogoControl />);
    const control = mockMap.addControl.mock.calls[0][0];
    const container = control.onAdd(mockMap);
    document.body.appendChild(container);
    const img = container.querySelector("img");
    const span = container.querySelector("span");

    expect(container.className).toBe("logo-container");
    expect(img).toBeInTheDocument();
    expect(img.alt).toBe("logo");
    expect(span).toBeInTheDocument();
    expect(span.textContent).toContain("All rights reserved");
  });
});
