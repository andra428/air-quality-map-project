import { combineReducers, configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import DayMetrics from "./DayMetrics";
import uiReducer from "../Auth/uiSlice";
import metricsReducer from "../Auth/metricsSlice";

jest.mock("recharts", () => {
  const Original = jest.requireActual("recharts");
  return {
    ...Original,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    LineChart: ({ children, margin }: any) => (
      <div data-testid="line-chart" data-margin={JSON.stringify(margin)}>
        {children}
      </div>
    ),
    Line: ({ type, dataKey, stroke, dot }: any) => (
      <div
        data-testid="line"
        data-type={type}
        data-datakey={dataKey}
        data-stroke={stroke}
        data-dot={dot?.toString()}
      />
    ),
    XAxis: ({ dataKey, type, ticks, tickLine }: any) => (
      <div
        data-testid="x-axis"
        data-datakey={dataKey}
        data-type={type}
        data-ticks={JSON.stringify(ticks)}
        data-tickline={tickLine?.toString()}
      />
    ),
    YAxis: ({ width, ticks, axisLine, tickLine }: any) => (
      <div
        data-testid="y-axis"
        data-width={width}
        data-ticks={JSON.stringify(ticks)}
        data-axisline={axisLine?.toString()}
        data-tickline={tickLine?.toString()}
      />
    ),
    CartesianGrid: ({ stroke, vertical }: any) => (
      <div
        data-testid="cartesian-grid"
        data-stroke={stroke}
        data-vertical={vertical?.toString()}
      />
    ),
    ReferenceLine: ({ x, y, stroke, strokeDasharray, strokeWidth }: any) => (
      <div
        data-testid="reference-line"
        data-x={x}
        data-y={y}
        data-stroke={stroke}
        data-strokedasharray={strokeDasharray}
        data-strokewidth={strokeWidth}
      />
    ),
  };
});

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
        id: "1",
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
        id: "2",
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
        id: "3",
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
    selectedDevice: null,
  },
  ui: {
    isSettingsModalOpen: false,
    isProfilePageModalOpen: false,
    isEditPageOpen: true,
    isRemoveDevicePageOpen: false,
    isAddNewPageModalOpen: false,
    isMessagePageOpen: false,
    editingDeviceId: "3",
    messageText: null,
    messageType: null,
    isMetricsPageOpen: false,
    metricsDeviceId: null,
    lastDeviceId: "3",
  },
  metrics: {
    "1": {
      current: undefined,
      today: {
        temp: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          value: 20 + (i % 5),
        })),
        pm25: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          value: 1 + (i % 9),
        })),
        co2: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          value: 35 + (i % 10),
        })),
        aqi: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          value: 10 + (i % 40),
        })),
      },
      week: {
        temp: Array.from({ length: 7 }, (_, i) => ({ hour: i, value: 20 + i })),
        pm25: Array.from({ length: 7 }, (_, i) => ({ hour: i, value: 2 + i })),
        co2: Array.from({ length: 7 }, (_, i) => ({ hour: i, value: 35 + i })),
        aqi: Array.from({ length: 7 }, (_, i) => ({
          hour: i,
          value: 10 + i * 5,
        })),
      },
    },
  },
};

const mockAuthReducerWithUser = (
  state = preloadedStateWithUser.auth,
  _action: any
) => state;
const mockDevicesReducerWithUser = (
  state = preloadedStateWithUser.device,
  _action: any
) => state;
const testReducerWithUser = combineReducers({
  auth: mockAuthReducerWithUser,
  ui: uiReducer,
  device: mockDevicesReducerWithUser,
  metrics: metricsReducer,
});

describe("DayMetrics component", () => {
  let store: any;

  beforeAll(() => {
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    (global as any).ResizeObserver = ResizeObserver;
    jest.spyOn(console, "warn").mockImplementation((msg) => {
      if (
        typeof msg === "string" &&
        msg.includes(
          "The width(0) and height(0) of chart should be greater than 0"
        )
      ) {
        return;
      }
      console.warn(msg);
    });
  });
  beforeEach(() => {
    store = configureStore({
      reducer: testReducerWithUser,
      preloadedState: preloadedStateWithUser,
    });
  });

  test("renders PM2.5 title and range when type=pm25 & timeType=today", () => {
    render(
      <Provider store={store}>
        <DayMetrics
          type="pm25"
          timeType="today"
          device={preloadedStateWithUser.device.devices[0]}
        />
      </Provider>
    );

    expect(screen.getByText("PM2.5")).toBeInTheDocument();
    expect(screen.getByText("Normal range: 1-9")).toBeInTheDocument();
  });
  test("renders CO2 title and range when type=co2 & timeType=week", () => {
    render(
      <Provider store={store}>
        <DayMetrics
          type="co2"
          timeType="week"
          device={preloadedStateWithUser.device.devices[0]}
        />
      </Provider>
    );

    expect(screen.getByText("CO2")).toBeInTheDocument();
    expect(screen.getByText("Normal range < 40")).toBeInTheDocument();
  });
  test("renders exactly 2 ReferenceLine components for CO2 type with today timeType", async () => {
    render(
      <Provider store={store}>
        <DayMetrics
          type="co2"
          timeType="today"
          device={preloadedStateWithUser.device.devices[0]}
        />
      </Provider>
    );

    await waitFor(() => {
      const referenceLines = screen.getAllByTestId("reference-line");

      expect(referenceLines).toHaveLength(2);

      const yLine = referenceLines.find(
        (line) => line.getAttribute("data-y") === "40"
      );
      expect(yLine).toBeInTheDocument();

      const xLine = referenceLines.find(
        (line) => line.getAttribute("data-x") === "10"
      );
      expect(xLine).toBeInTheDocument();
    });
  });
  test("renders exactly 2 ReferenceLine components for CO2 type with week timeType", async () => {
    render(
      <Provider store={store}>
        <DayMetrics
          type="co2"
          timeType="week"
          device={preloadedStateWithUser.device.devices[0]}
        />
      </Provider>
    );

    await waitFor(() => {
      const referenceLines = screen.getAllByTestId("reference-line");

      expect(referenceLines).toHaveLength(2);

      const yLine = referenceLines.find(
        (line) => line.getAttribute("data-y") === "40"
      );
      expect(yLine).toBeInTheDocument();

      const xLine = referenceLines.find(
        (line) => line.getAttribute("data-x") === "3.5"
      );
      expect(xLine).toBeInTheDocument();
    });
  });
  test("renders only 1 ReferenceLine component for PM2.5 type and today (only Y line)", async () => {
    render(
      <Provider store={store}>
        <DayMetrics
          type="pm25"
          timeType="today"
          device={preloadedStateWithUser.device.devices[0]}
        />
      </Provider>
    );

    await waitFor(() => {
      const referenceLines = screen.getAllByTestId("reference-line");

      expect(referenceLines).toHaveLength(1);

      const yLine = referenceLines.find(
        (line) => line.getAttribute("data-y") === "9"
      );
      expect(yLine).toBeInTheDocument();
    });
  });
  test("renders only 1 ReferenceLine component for PM2.5 type and week (only Y line)", async () => {
    render(
      <Provider store={store}>
        <DayMetrics
          type="pm25"
          timeType="week"
          device={preloadedStateWithUser.device.devices[0]}
        />
      </Provider>
    );

    await waitFor(() => {
      const referenceLines = screen.getAllByTestId("reference-line");

      expect(referenceLines).toHaveLength(1);

      const yLine = referenceLines.find(
        (line) => line.getAttribute("data-y") === "9"
      );
      expect(yLine).toBeInTheDocument();
    });
  });
  test("renders no ReferenceLine components for temperature type", async () => {
    render(
      <Provider store={store}>
        <DayMetrics
          type="temp"
          timeType="today"
          device={preloadedStateWithUser.device.devices[0]}
        />
      </Provider>
    );

    await waitFor(() => {
      const referenceLines = screen.queryAllByTestId("reference-line");

      expect(referenceLines).toHaveLength(0);
    });
  });
  test("dispatches fetchTodayDataThunk when todayData is undefined", async () => {
    const stateWithoutTodayData = {
      ...preloadedStateWithUser,
      metrics: {
        "1": {
          current: undefined,
          today: undefined,
          week: preloadedStateWithUser.metrics["1"].week,
        },
      },
    };

    const storeWithoutToday = configureStore({
      reducer: testReducerWithUser,
      preloadedState: stateWithoutTodayData,
    });
    const spy = jest.spyOn(storeWithoutToday, "dispatch");
    render(
      <Provider store={storeWithoutToday}>
        <DayMetrics
          type="pm25"
          timeType="today"
          device={stateWithoutTodayData.device.devices[0]}
        />
      </Provider>
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });
  test("dispatches fetchWeekDataThunk when weekData is undefined", async () => {
    const stateWithoutWeekData = {
      ...preloadedStateWithUser,
      metrics: {
        "1": {
          current: undefined,
          today: preloadedStateWithUser.metrics["1"].today,
          week: undefined,
        },
      },
    };

    const storeWithoutWeek = configureStore({
      reducer: testReducerWithUser,
      preloadedState: stateWithoutWeekData,
    });
    const spy = jest.spyOn(storeWithoutWeek, "dispatch");
    render(
      <Provider store={storeWithoutWeek}>
        <DayMetrics
          type="pm25"
          timeType="week"
          device={stateWithoutWeekData.device.devices[0]}
        />
      </Provider>
    );

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("renders partial today data without crashing", async () => {
    const partialState = {
      ...preloadedStateWithUser,
      metrics: {
        "1": {
          today: { pm25: [{ hour: 0, value: 5 }], co2: [], aqi: [], temp: [] },
          week: undefined,
        },
      },
    };

    const storePartial = configureStore({
      reducer: testReducerWithUser,
      preloadedState: partialState,
    });

    render(
      <Provider store={storePartial}>
        <DayMetrics
          type="pm25"
          timeType="today"
          device={partialState.device.devices[0]}
        />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
  });
});
