import { FormEvent, useRef, useState } from "react";
import EditDevice from "./EditDevice";
import styles2 from "./AddNew.module.css";
import styles from "../Profile/Profile.module.css";
import x from "../assets/x.svg";
import { useAppSelector } from "../hooks/useAppSelector";
import { RootState } from "../store/store";
import locationPin from "../assets/locationPin.svg";
import EditButtons from "./EditButtons";
import { useAppDispatch } from "../hooks/useAppDispatch";
import {
  closeEditPage,
  openMessagePageModal,
  openMetricsPage,
  openProfilePageModal,
  openRemoveDevicePage,
} from "../Auth/uiSlice";
import back from "../assets/back.svg";
import { updateDocument } from "./CollectionOperations";
import { DeviceData, updateDevice } from "../Auth/deviceSlice";
import { useIsMobile } from "../hooks/useMediaQuery";

interface EditDeviceWrapperProps {
  onClose: () => void;
}
export default function EditDeviceWrapper({ onClose }: EditDeviceWrapperProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const editingDeviceId = useAppSelector(
    (state: RootState) => state.ui.editingDeviceId
  );
  const devices = useAppSelector((state: RootState) => state.device.devices);
  const device = devices.find((dev) => dev.id === editingDeviceId);
  const [locationConfirmed, setLocationConfirmed] = useState(true);
  if (!device) {
    return null;
  }
  const [coords, setCoords] = useState({
    lat: device!.deviceLat,
    long: device!.deviceLong,
  });
  const lastDeviceId = useAppSelector(
    (state: RootState) => state.ui.lastDeviceId
  );
  function handleRemove() {
    dispatch(openRemoveDevicePage());
  }

  async function handleEdit(event: FormEvent) {
    event.preventDefault();
    if (!formRef.current || !device) return;

    const formData = new FormData(formRef.current);

    const dataToUpdate: Partial<DeviceData> = {};
    const deviceName = formData.get("deviceName") as string;
    const description = formData.get("description") as string;
    const locationValue = formData.get("location") as string;
    if (
      !deviceName ||
      typeof deviceName !== "string" ||
      !description ||
      typeof description !== "string" ||
      coords.lat === 0 ||
      coords.long === 0 ||
      !locationValue ||
      typeof locationValue !== "string"
    ) {
      alert("Device name, description and location need to be filled");
      return;
    }
    if (deviceName !== device.deviceName) {
      dataToUpdate.deviceName = deviceName;
    }
    if (description !== device.description) {
      dataToUpdate.description = description;
    }
    if (locationValue !== device.deviceAddress && locationConfirmed) {
      dataToUpdate.deviceAddress = locationValue;
      dataToUpdate.deviceLat = coords.lat;
      dataToUpdate.deviceLong = coords.long;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      alert("No changes were made");
      return;
    }

    try {
      await updateDocument(device.id, dataToUpdate);
      dispatch(updateDevice({ id: device.id, ...dataToUpdate }));
      dispatch(
        openMessagePageModal({
          text: "Success! The device was updated.",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        openMessagePageModal({
          text: "Oops! The device could not be updated. Try again.",
          type: "error",
        })
      );
      console.log(error);
    }
  }
  function handleBackButton() {
    if (lastDeviceId) {
      if (device) {
        dispatch(closeEditPage());
        dispatch(openMetricsPage(lastDeviceId));
      }
    } else {
      dispatch(closeEditPage());
      dispatch(openProfilePageModal());
    }
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
    <>
      <div className={`${styles.modalProfile}`}>
        <div className={styles2.paddingEdit}>
          {contentHeading}
          <span className={`${styles2.detailsDeviceRow} ${styles2.mbsm}`}>
            <img
              className={styles2.locationPin}
              src={locationPin}
              alt="locPin"
            />
            {device.deviceAddress}
          </span>
          <EditDevice
            formRef={formRef}
            device={device}
            onUpdateCoords={(coords, confirmed) => {
              setCoords(coords);
              setLocationConfirmed(confirmed);
            }}
          />

          <EditButtons
            onClose={onClose}
            onRemove={handleRemove}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </>
  );
}
