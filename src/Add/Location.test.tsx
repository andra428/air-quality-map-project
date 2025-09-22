import { getLocation, getCoordsFromAddress } from "./Location";
import "@testing-library/jest-dom";
describe("Location", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("getLocation : returns current location when geolocation and fetch succeed", async () => {
    const mockGetCurrentPosition = jest.fn((success) =>
      success({
        coords: { latitude: 47.15, longitude: 27.6 },
      })
    );
    Object.defineProperty(global.navigator, "geolocation", {
      value: { getCurrentPosition: mockGetCurrentPosition },
      configurable: true,
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        address: { road: "Strada Mare", city: "Iași", country: "Romania" },
      }),
    }) as any;

    const result = await getLocation();

    expect(result).toEqual({
      address: "Strada Mare, Iași, Romania",
      coords: { lat: 47.15, long: 27.6 },
    });

    expect(mockGetCurrentPosition).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/reverse?format=jsonv2&lat=47.15&lon=27.6"
    );
  });

  test("getLocation : rejects if browser does not support geolocation", async () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: undefined,
      configurable: true,
    });

    await expect(getLocation()).rejects.toBe(
      "Browser does not support geolocation."
    );
  });

  test("getLocation : rejects if fetch fails", async () => {
    const mockGetCurrentPosition = jest.fn((success) =>
      success({ coords: { latitude: 1, longitude: 2 } })
    );
    Object.defineProperty(global.navigator, "geolocation", {
      value: { getCurrentPosition: mockGetCurrentPosition },
      configurable: true,
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }) as any;

    await expect(getLocation()).rejects.toBe("The address could not be found.");
  });

  test("getLocation : rejects if geolocation returns an error", async () => {
    const mockGetCurrentPosition = jest.fn((_, errorCb) =>
      errorCb({ message: "User denied" })
    );
    Object.defineProperty(global.navigator, "geolocation", {
      value: { getCurrentPosition: mockGetCurrentPosition },
      configurable: true,
    });

    await expect(getLocation()).rejects.toBe("Geolocation error: User denied");
  });

  test("getCoordsFromAddress: returns array of locations when fetch succeeds", async () => {
    const mockData = [
      {
        display_name: "Iași, Romania",
        lat: "47.15",
        lon: "27.6",
      },
      {
        display_name: "București, Romania",
        lat: "44.43",
        lon: "26.1",
      },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    }) as any;

    const result = await getCoordsFromAddress("Romania");

    expect(result).toEqual([
      {
        address: "Iași, Romania",
        coords: { lat: 47.15, long: 27.6 },
      },
      {
        address: "București, Romania",
        coords: { lat: 44.43, long: 26.1 },
      },
    ]);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/search?format=jsonv2&q=Romania"
    );
  });

  test("getCoordsFromAddress: rejects if address is empty", async () => {
    await expect(getCoordsFromAddress("")).rejects.toBe(
      "Address cannot be empty"
    );
  });

  test("getCoordsFromAddress: rejects if fetch fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }) as any;

    await expect(getCoordsFromAddress("Romania")).rejects.toBe("Error: 500");
  });

  test("getCoordsFromAddress: rejects if no results are found", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }) as any;

    await expect(getCoordsFromAddress("Atlantis")).rejects.toBe(
      "No results found for this address"
    );
  });
});
