import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "./AirQualityMetrics.module.css";
import { useEffect } from "react";
import { DeviceData } from "../Auth/deviceSlice";
import GradientSVG from "./GradientSVG";
import { fetchCurrentData } from "../Auth/metricsSlice";
import { useAppSelector } from "../hooks/useAppSelector";
import { RootState } from "../store/store";
import { useAppDispatch } from "../hooks/useAppDispatch";
interface HourMetricsProps {
  type: string;
  device: DeviceData | undefined;
}
export default function HourMetrics({ type, device }: HourMetricsProps) {
  if (!device) {
    return null;
  }
  let value = 0;
  let max = 0;
  let title: string = "";
  let range: string = "";
  const dispatch = useAppDispatch();
  const currentData = useAppSelector((state: RootState) =>
    device ? state.metrics[device.id]?.current : null
  );

  useEffect(() => {
    if (!currentData) {
      dispatch(fetchCurrentData(device));
    }
  }, [device, currentData, dispatch]);
  if (currentData?.metrics) {
    if (type === "pm25") {
      title = "PM2.5";
      range = "Normal range: 1 - 9";
      max = 9;
      value = currentData.metrics.pm25;
    } else if (type === "co2") {
      title = "CO2";
      range = "Normal range < 1000";
      max = 1000;
      value = currentData.metrics.co;
    } else if (type === "temp") {
      title = "Temp";
      range = "In Celsius";
      max = 35;
      value = currentData.temp ?? 0;
    } else {
      title = "AQI";
      range = "Air Quality Index";
      max = 500;
      value = currentData.metrics.aqi;
    }
  }
  return (
    <div className={styles.hourMetric}>
      <GradientSVG id={`gradient-${type}`} value={value} max={max} />
      <div className={styles.hourDetails}>
        <span className={styles.title}>{title}</span>
        <span className={styles.range}>{range}</span>
      </div>
      <CircularProgressbar
        value={value}
        maxValue={max}
        text={`${value.toFixed(1)}`}
        styles={buildStyles({
          pathColor: `url(#gradient-${type})`,
          textColor: "#fff",
          trailColor: "#30363D",
        })}
      />
    </div>
  );
}
