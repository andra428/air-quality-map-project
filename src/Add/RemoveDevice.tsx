import { DeviceData, setDevices } from "../Auth/deviceSlice";
import {
  closeEditPage,
  closeRemoveDevicePage,
  openMessagePageModal,
  openProfilePageModal,
} from "../Auth/uiSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import styles from "../Profile/Profile.module.css";
import styles2 from "./AddNew.module.css";
import { deleteDocument, getDocuments } from "./CollectionOperations";
interface RemoveDeviceProps {
  onClose: () => void;
  device: DeviceData | undefined;
}
export default function RemoveDevice({ onClose, device }: RemoveDeviceProps) {
  const dispatch = useAppDispatch();
  async function handleRemove() {
    try {
      if (device) {
        await deleteDocument(device?.id);
        const newDevices = await getDocuments();
        dispatch(closeEditPage());
        dispatch(closeRemoveDevicePage());
        dispatch(openProfilePageModal());
        dispatch(
          openMessagePageModal({
            text: "Success! The device was removed.",
            type: "success",
          })
        );
        dispatch(setDevices(newDevices));
      }
    } catch (e: any) {
      dispatch(
        openMessagePageModal({
          text: "Oops! The device could not be removed.",
          type: "error",
        })
      );
      alert("The device could not be deleted");
    }
  }
  return (
    <div className={styles.aboutModalOverlay}>
      <div className={styles2.removeDeviceContainer}>
        <h1>
          Are you sure you want to delete the {device?.deviceName} device?
        </h1>
        <span className={styles2.removeDeviceBtns}>
          <button className={styles2.btnAdd} onClick={handleRemove}>
            Yes
          </button>
          <button className={styles2.btnAdd} onClick={onClose}>
            No
          </button>
        </span>
      </div>
    </div>
  );
}
