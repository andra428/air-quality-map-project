import styles2 from "./AddNew.module.css";
import styles from "./AirQualityMetrics.module.css";
import locationPin from "../assets/locationPin.svg";
import editIcon from "../assets/edit.svg";
import { DeviceData } from "../Auth/deviceSlice";
import { useAppSelector } from "../hooks/useAppSelector";
import { RootState } from "../store/store";
import { useAppDispatch } from "../hooks/useAppDispatch";
import {
  closeEditPage,
  closeProfilePageModal,
  openEditPage,
  openMetricsPage,
} from "../Auth/uiSlice";

import { useEffect } from "react";
import AirQualityMetric from "./AirQualityMetric";
import AirQualityMetricPM25 from "./AirQualityMetricPM25";
import { fetchCurrentData } from "../Auth/metricsSlice";
interface DeviceProps {
  device: DeviceData;
}
export interface AirQualityMetrics {
  city_name: string;
  country_code: string;
  pm25: number;
  co: number;
  aqi: number;
}
export default function Device({ device }: DeviceProps) {
  const currentUser = useAppSelector(
    (state: RootState) => state.auth.currentUser
  );
  const currentData = useAppSelector((state: RootState) =>
    device ? state.metrics[device.id]?.current : null
  );

  const editingDeviceId = device.id;
  const dispatch = useAppDispatch();
  function handleEditPage() {
    dispatch(closeProfilePageModal());
    dispatch(openEditPage(editingDeviceId));
  }
  useEffect(() => {
    if (!currentData) {
      dispatch(fetchCurrentData(device));
    }
  }, [device, currentData, dispatch]);
  function handleMetrics() {
    dispatch(closeProfilePageModal());
    dispatch(closeEditPage());
    dispatch(openMetricsPage(device.id));
  }
  return (
    <span
      className={`${styles2.deviceDetailsTextPopup} ${styles2.devicePopup}`}
    >
      <div className={styles2.deviceStats}>
        {currentData?.metrics ? (
          <AirQualityMetricPM25 pm25={currentData.metrics.pm25} />
        ) : (
          <span>O</span>
        )}
        <div className={styles2.deviceDetail}>
          <button className={styles2.btnSeeStats} onClick={handleMetrics}>
            <span className={styles2.titleDevice}>{device.deviceName}</span>
          </button>
          <span className={styles2.detailsDeviceRow}>
            <img
              className={styles2.locationPin}
              src={locationPin}
              alt="locPin"
            />
            <span>{device.deviceAddress}</span>
          </span>
          {currentUser && currentUser.uid === device.userId ? (
            <button
              onClick={handleEditPage}
              className={`${styles2.detailsDeviceRow} ${styles2.btnEditDevice}`}
            >
              <img className={styles2.editPin} src={editIcon} alt="locPin" />
              <span>Edit</span>
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <span className={styles.metricsStats}>
        <AirQualityMetric value={currentData?.metrics?.co ?? 0} type="co2">
          CO2
        </AirQualityMetric>
        <AirQualityMetric value={currentData?.temp ?? 0} type="temp">
          Temp
        </AirQualityMetric>
        <AirQualityMetric value={currentData?.metrics?.aqi ?? 0} type="aqi">
          AQI
        </AirQualityMetric>
      </span>
    </span>
  );
}
