import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { DeviceData } from "../Auth/deviceSlice";
import { useEffect, useState } from "react";
import styles from "./AirQualityMetrics.module.css";
import { fetchTodayDataThunk, fetchWeekDataThunk } from "../Auth/metricsSlice";
import { useAppSelector } from "../hooks/useAppSelector";
import { RootState } from "../store/store";
import { useAppDispatch } from "../hooks/useAppDispatch";
interface DailyMetric {
  hour: number;
  value: number;
}

interface DayMetricsProps {
  type: string;
  timeType: string;
  device: DeviceData | undefined;
}
export default function DayMetrics({
  type,
  device,
  timeType,
}: DayMetricsProps) {
  if (!device) {
    return null;
  }
  let values: DailyMetric[] = [];
  let ticksY: number[] = [];
  let ticksX: number[] = [];
  let title: string = "";
  let range: string = "";
  let dataKey: string = "value";
  const todayData = useAppSelector(
    (state: RootState) => device && state.metrics[device.id]?.today
  );
  const weekData = useAppSelector(
    (state: RootState) => device && state.metrics[device.id]?.week
  );
  const dispatch = useAppDispatch();
  const [temp, setTemp] = useState<DailyMetric[]>([]);
  const [pm25, setPM25] = useState<DailyMetric[]>([]);
  const [co2, setCO2] = useState<DailyMetric[]>([]);
  const [aqi, setAQI] = useState<DailyMetric[]>([]);
  let normalRangeMaxY: number = 0;
  let normalRangeMaxX: number = 0;

  useEffect(() => {
    if (timeType === "today") {
      if (!todayData) {
        dispatch(fetchTodayDataThunk(device));
      } else {
        setTemp(todayData.temp);
        setPM25(todayData.pm25);
        setCO2(todayData.co2);
        setAQI(todayData.aqi);
      }
    }
    if (timeType === "week") {
      if (!weekData) {
        dispatch(fetchWeekDataThunk(device));
      } else {
        setTemp(weekData.temp);
        setPM25(weekData.pm25);
        setCO2(weekData.co2);
        setAQI(weekData.aqi);
      }
    }
  }, [timeType, device, dispatch, todayData, weekData]);

  if (timeType === "today") {
    ticksX = [0, 10, 24];
    if (type === "pm25") {
      values = [...pm25];
      ticksY = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
      title = "PM2.5";
      range = "Normal range: 1-9";
      normalRangeMaxY = 9;
    } else if (type === "co2") {
      values = [...co2];
      ticksY = [0, 10, 20, 30, 40, 50, 60, 70, 80];
      title = "CO2";
      range = "Normal range < 40";
      normalRangeMaxY = 40;
      normalRangeMaxX = 10;
    } else if (type === "aqi") {
      values = [...aqi];
      ticksY = [0, 10, 20, 30, 40, 50, 60, 70, 80];
      title = "AQI";
      range = "Air Quality Index";
    } else {
      values = [...temp];
      ticksY = [-10, -5, 0, 5, 10, 15, 20, 25, 30];
      title = "Temperature";
      range = "Celsius";
    }
  }
  if (timeType == "week") {
    ticksX = [0, 7];
    if (type === "pm25") {
      values = [...pm25];
      ticksY = [0, 10, 20, 30];
      title = "PM2.5";
      range = "Normal range: 1-9";
      normalRangeMaxY = 9;
    } else if (type === "co2") {
      values = [...co2];
      ticksY = [0, 10, 20, 30, 40, 50, 60, 70, 80];
      title = "CO2";
      range = "Normal range < 40";
      normalRangeMaxY = 40;
      normalRangeMaxX = 3.5;
    } else if (type === "aqi") {
      values = [...aqi];

      ticksY = [0, 10, 20, 30, 40, 50, 60, 70, 80];
      title = "AQI";
      range = "Air Quality Index";
    } else {
      values = [...temp];
      ticksY = [-10, -5, 0, 5, 10, 15, 20, 25, 30];
      title = "Temperature";
      range = "Celsius";
    }
  }
  return (
    <div className={styles.dayMetricsContainer}>
      <span className={`${styles.title} ${styles.mbleft}`}>{title}</span>
      <span className={`${styles.range} ${styles.mbleft}`}>{range}</span>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={values}
          margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#555" vertical={false} />
          <YAxis width={25} ticks={ticksY} axisLine={false} tickLine={false} />
          <XAxis dataKey="hour" type="number" ticks={ticksX} tickLine={false} />
          {normalRangeMaxY && (
            <ReferenceLine
              y={normalRangeMaxY}
              stroke="#fff"
              strokeDasharray="0"
              strokeWidth={2}
            />
          )}

          {normalRangeMaxX && (
            <ReferenceLine
              x={normalRangeMaxX}
              stroke="#fff"
              strokeDasharray="0"
              strokeWidth={1}
            />
          )}

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#8884d8"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
