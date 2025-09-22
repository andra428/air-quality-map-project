import { configureStore } from "@reduxjs/toolkit";
import metricsReducer, {
  fetchCurrentData,
  fetchTodayDataThunk,
  fetchWeekDataThunk,
} from "../Auth/metricsSlice";
import { DeviceData } from "../Auth/deviceSlice";
import { AirQualityMetrics } from "../Add/Device";
import { TimeSeriesData } from "../Auth/metricsSlice";

global.fetch = jest.fn();

const mockFetch = fetch as jest.Mock;

describe("Weather API calls", () => {
  const device: DeviceData = {
    id: "1",
    description: "My laptop",
    deviceAddress: "Aleea Profesor Vasile Petrescu, Iași,Romania",
    deviceLat: 47.157176969640766,
    deviceLong: 27.60457611625316,
    deviceName: "Mac",
    userEmail: "alupu@griddynamics.com",
    userId: "GW7cGeR2aJcc8RJvhZXcbWu7Fwk2",
    userName: "Andra Maria Lupu",
  };

  let store: any;
  let dispatchSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        metrics: metricsReducer,
      },
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
    jest.clearAllMocks();
  });

  test("should fetch current metrics + temp and store them", async () => {
    const metrics: AirQualityMetrics = {
      city_name: "Test City",
      country_code: "TC",
      pm25: 12,
      co: 0.5,
      aqi: 40,
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          city_name: metrics.city_name,
          country_code: metrics.country_code,
          data: [{ pm25: metrics.pm25, co: metrics.co, aqi: metrics.aqi }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ temp: 22 }],
        }),
      });

    await store.dispatch(fetchCurrentData(device));

    const state = store.getState().metrics;
    expect(state[device.id].current).toEqual({
      metrics,
      temp: 22,
    });
  });

  test("should fetch today data and store it", async () => {
    const today: TimeSeriesData = {
      pm25: [{ hour: 0, value: 10 }],
      co2: [{ hour: 0, value: 0.2 }],
      aqi: [{ hour: 0, value: 30 }],
      temp: [{ hour: 0, value: 25 }],
    };
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ pm25: 10, co: 0.2, aqi: 30 }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ temp: 25 }],
        }),
      });

    await store.dispatch(fetchTodayDataThunk(device));

    const state = store.getState().metrics;
    expect(state[device.id].today).toEqual(today);
  });

  test("should fetch week data and store it", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            { pm25: 12, co: 0.4, aqi: 50 },
            ...Array(23).fill({ pm25: 12, co: 0.4, aqi: 50 }),
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ temp: 20 }],
        }),
      });

    await store.dispatch(fetchWeekDataThunk(device));

    const state = store.getState().metrics;
    const week = state[device.id].week;

    expect(week.pm25[0].value).toBeCloseTo(12, 5);
    expect(week.co2[0].value).toBeCloseTo(0.4, 5);
    expect(week.aqi[0].value).toBeCloseTo(50, 5);
    expect(week.temp[0].value).toBeCloseTo(20, 5);
  });
  test("should handle error/reject when current metrics fetch fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const action = await store.dispatch(fetchCurrentData(device));

    expect(action.type).toBe("metrics/fetchCurrentData/rejected");

    expect(action.error.message).toContain("Error: 500");
  });

  test("should handle empty today data as rejected", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) });

    const action = await store.dispatch(fetchTodayDataThunk(device));

    expect(action.type).toBe("metrics/fetchTodayData/rejected");
    expect(action.error.message).toBe("No today data available");
  });
  test("should reject if today temperature fetch fails", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [{ pm25: 10, co: 0.2, aqi: 30 }] }),
      })
      .mockResolvedValueOnce({ ok: false, status: 500 });

    const action = await store.dispatch(fetchTodayDataThunk(device));

    expect(action.type).toBe("metrics/fetchTodayData/rejected");
    expect(action.error.message).toContain("Temp error: 500");
  });

  test("should handle missing week temperature data as error/rejected", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

    const action = await store.dispatch(fetchWeekDataThunk(device));

    expect(action.type).toBe("metrics/fetchWeekData/rejected");
    expect(action.error.message).toBe("No week data available");
  });
  test("should reject if week air quality fetch fails", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [{ temp: 20 }] }),
      });

    const action = await store.dispatch(fetchWeekDataThunk(device));

    expect(action.type).toBe("metrics/fetchWeekData/rejected");
    expect(action.error.message).toContain("AirQuality error: 500");
  });
});
