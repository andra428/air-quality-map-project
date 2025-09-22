import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DeviceData } from "../Auth/deviceSlice";
import {
  fetchTodayData,
  getCurrentMetrics,
  getCurrentTemp,
  fetchWeekData,
} from "../Add/WeatherAPI";
import { AirQualityMetrics } from "../Add/Device";

interface CurrentData {
  metrics?: AirQualityMetrics;
  temp?: number;
}

export interface TimeSeriesData {
  pm25: { hour: number; value: number }[];
  co2: { hour: number; value: number }[];
  aqi: { hour: number; value: number }[];
  temp: { hour: number; value: number }[];
}

interface MetricsState {
  [deviceId: string]: {
    current?: CurrentData;
    today?: TimeSeriesData;
    week?: TimeSeriesData;
  };
}

const initialState: MetricsState = {};

export const fetchCurrentData = createAsyncThunk(
  "metrics/fetchCurrentData",
  async (device: DeviceData) => {
    const [metrics, temp] = await Promise.all([
      getCurrentMetrics(device),
      getCurrentTemp(device),
    ]);
    if (!metrics) throw new Error("No metrics found");
    return { deviceId: device.id, metrics, temp };
  }
);

export const fetchTodayDataThunk = createAsyncThunk(
  "metrics/fetchTodayData",
  async (device: DeviceData) => {
    const todayData = await fetchTodayData(device);
    return { deviceId: device.id, today: todayData };
  }
);

export const fetchWeekDataThunk = createAsyncThunk(
  "metrics/fetchWeekData",
  async (device: DeviceData) => {
    const weekData = await fetchWeekData(device);
    return { deviceId: device.id, week: weekData };
  }
);

const metricsSlice = createSlice({
  name: "metrics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentData.fulfilled, (state, action) => {
      const { deviceId, metrics, temp } = action.payload;
      if (!state[deviceId]) state[deviceId] = {};
      state[deviceId].current = { metrics, temp };
    });
    builder.addCase(fetchTodayDataThunk.fulfilled, (state, action) => {
      const { deviceId, today } = action.payload;
      if (!state[deviceId]) state[deviceId] = {};
      state[deviceId].today = today;
    });
    builder.addCase(fetchWeekDataThunk.fulfilled, (state, action) => {
      const { deviceId, week } = action.payload;
      if (!state[deviceId]) state[deviceId] = {};
      state[deviceId].week = week;
    });
  },
});

export default metricsSlice.reducer;
