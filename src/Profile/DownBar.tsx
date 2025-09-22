import styles from "./Profile.module.css";
import mapActive from "../assets/mapActive.svg";
import addBtn from "../assets/add.svg";
import settings from "../assets/settings2.svg";
import { openProfilePageModal, openSettingsModal } from "../Auth/uiSlice";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import type { RootState } from "../store/store";

export default function DownBar() {
  const currentUser = useAppSelector(
    (state: RootState) => state.auth.currentUser
  );
  const dispatch = useAppDispatch();

  function handleModal() {
    if (!currentUser) {
      dispatch(openSettingsModal());
    } else if (currentUser) {
      dispatch(openProfilePageModal());
    }
  }

  return (
    <div className={styles.downBarContainer}>
      <button className={styles.btnDownBarContainer}>
        <img src={mapActive} alt="mapActive" />
      </button>
      <button className={styles.btnDownBarContainer}>
        <img src={addBtn} alt="addBtn" />
      </button>
      <button className={styles.btnDownBarContainer} onClick={handleModal}>
        <img src={settings} alt="settings" />
      </button>
    </div>
  );
}
