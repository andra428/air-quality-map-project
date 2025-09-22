import styles from "../Profile/Profile.module.css";
import styles2 from "./AddNew.module.css";
import styles3 from "./AirQualityMetrics.module.css";
import x from "../assets/x.svg";
import { useAppSelector } from "../hooks/useAppSelector";
import { RootState } from "../store/store";
import locationPin from "../assets/locationPin.svg";
import editIcon from "../assets/edit.svg";
import { useAppDispatch } from "../hooks/useAppDispatch";
import back from "../assets/back.svg";
import {
  closeMetricsPage,
  closeProfilePageModal,
  openEditPage,
  openProfilePageModal,
  openRemoveDevicePage,
} from "../Auth/uiSlice";
import deleteIcon from "../assets/delete.svg";
import { useState } from "react";
import HourMetrics from "./HourMetrics";
import DayMetrics from "./DayMetrics";
import { useIsMobile } from "../hooks/useMediaQuery";
interface DeviceMetricsProps {
  onClose: () => void;
}
export default function DeviceMetrics({ onClose }: DeviceMetricsProps) {
  const [timeType, setTimeType] = useState<string>("hour");
  const metricsDeviceId = useAppSelector(
    (state: RootState) => state.ui.metricsDeviceId
  );
  const currentUser = useAppSelector(
    (state: RootState) => state.auth.currentUser
  );
  const dispatch = useAppDispatch();
  const devices = useAppSelector((state: RootState) => state.device.devices);
  const device = devices.find((dev) => dev.id === metricsDeviceId);
  function handleEditPage() {
    dispatch(closeProfilePageModal());
    dispatch(closeMetricsPage());
    dispatch(openEditPage(device!.id));
  }
  const isMobile = useIsMobile();
  function handleRemove() {
    dispatch(openRemoveDevicePage());
  }
  function handleContent(value: string) {
    setTimeType(value);
  }
  function handleBackButton() {
    dispatch(closeMetricsPage());
    if (currentUser?.uid === device?.userId) {
      dispatch(openProfilePageModal());
    }
  }
  let content = <></>;
  if (timeType === "hour") {
    content = (
      <div className={styles2.mbsm}>
        <div className={styles3.displayMetrics}>
          <div className={styles3.metricBG}>
            <HourMetrics type="pm25" device={device} />
          </div>
          <div className={styles3.metricBG}>
            <HourMetrics type="co2" device={device} />
          </div>
        </div>
        <div className={styles3.displayMetrics}>
          <div className={styles3.metricBG}>
            <HourMetrics type="temp" device={device} />
          </div>
          <div className={styles3.metricBG}>
            <HourMetrics type="aqi" device={device} />
          </div>
        </div>
      </div>
    );
  } else if (timeType === "today") {
    content = (
      <>
        <div className={styles2.mbsm}>
          <div className={styles3.displayMetrics}>
            <div className={styles3.metricBG}>
              <DayMetrics type="pm25" device={device} timeType="today" />
            </div>
            <div className={styles3.metricBG}>
              <DayMetrics type="co2" device={device} timeType="today" />
            </div>
          </div>
          <div className={styles3.displayMetrics}>
            <div className={styles3.metricBG}>
              <DayMetrics type="temp" device={device} timeType="today" />
            </div>
            <div className={styles3.metricBG}>
              <DayMetrics type="aqi" device={device} timeType="today" />
            </div>
          </div>
        </div>
      </>
    );
  } else {
    content = (
      <>
        <div className={styles2.mbsm}>
          <div className={styles3.displayMetrics}>
            <div className={styles3.metricBG}>
              <DayMetrics type="pm25" device={device} timeType="week" />
            </div>
            <div className={styles3.metricBG}>
              <DayMetrics type="co2" device={device} timeType="week" />
            </div>
          </div>
          <div className={styles3.displayMetrics}>
            <div className={styles3.metricBG}>
              <DayMetrics type="temp" device={device} timeType="week" />
            </div>
            <div className={styles3.metricBG}>
              <DayMetrics type="aqi" device={device} timeType="week" />
            </div>
          </div>
        </div>
      </>
    );
  }
  let contentHeading = <></>;
  if (!isMobile) {
    contentHeading = (
      <span className={styles2.headingEdit}>
        <span className={styles2.headingDeviceName}>{device?.deviceName}</span>
        <span className={styles.headingX}>
          <button className={styles.btnClose} onClick={onClose}>
            <img src={x} alt="x" />
          </button>
        </span>
      </span>
    );
  } else {
    contentHeading = (
      <span className={styles.heading}>
        <span className={styles.headingCombined}>
          <button className={styles.btnClose} onClick={handleBackButton}>
            <img src={back} alt="back" />
          </button>
          <span className={styles2.headingDeviceName}>
            {device?.deviceName}
          </span>
        </span>
      </span>
    );
  }
  return (
    <div className={`${styles.modalProfile}`}>
      <div className={styles2.paddingEdit}>
        {contentHeading}
        <span className={`${styles2.detailsDeviceRow} ${styles2.mbsm2}`}>
          <img className={styles2.locationPin} src={locationPin} alt="locPin" />
          {device?.deviceAddress}
        </span>
        {currentUser && currentUser.uid === device?.userId ? (
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
        <div className={styles3.btnDeviceTime}>
          <button
            className={`${
              timeType === "hour" ? styles3.btnTimeActive : styles3.btnTime
            }`}
            onClick={() => handleContent("hour")}
          >
            Hour
          </button>
          <button
            className={`${
              timeType === "today" ? styles3.btnTimeActive : styles3.btnTime
            }`}
            onClick={() => handleContent("today")}
          >
            Today
          </button>
          <button
            className={`${
              timeType === "week" ? styles3.btnTimeActive : styles3.btnTime
            }`}
            onClick={() => handleContent("week")}
          >
            Week
          </button>
        </div>
        {content}
        {currentUser && currentUser.uid === device?.userId ? (
          <button className={styles2.btnRemoveContainer} onClick={handleRemove}>
            <img src={deleteIcon} alt="delIcon" />
            <span>Remove device</span>
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
