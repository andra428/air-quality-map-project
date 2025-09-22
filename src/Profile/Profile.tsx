import notifLogo from "../assets/notif.svg";
import arrowDownLogo from "../assets/arrowDown.svg";
import notifications from "../assets/notifications.svg";
import styles from "./Profile.module.css";
import { createPortal } from "react-dom";
import {
  openProfilePageModal,
  openSettingsModal,
  closeProfilePageModal,
  closeSettingsModal,
  closeEditPage,
  closeRemoveDevicePage,
  closeMetricsPage,
} from "../Auth/uiSlice";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import type { RootState } from "../store/store";
import Settings from "./Settings";
import ProfilePage from "./ProfilePage";
import { useIsMobile } from "../hooks/useMediaQuery";
import AddNew from "../Add/AddNew";
import { closeAddNewPageModal } from "../Auth/uiSlice";
import EditDeviceWrapper from "../Add/EditDeviceWrapper";
import RemoveDevice from "../Add/RemoveDevice";
import { useUserDevices } from "../hooks/useUserDevices";
import DeviceMetrics from "../Add/DeviceMetrics";
export default function Profile() {
  const isMobile = useIsMobile();
  const devices = useUserDevices();
  const isEditPageOpen = useAppSelector(
    (state: RootState) => state.ui.isEditPageOpen
  );
  const currentUser = useAppSelector(
    (state: RootState) => state.auth.currentUser
  );
  const editingDeviceId = useAppSelector(
    (state: RootState) => state.ui.editingDeviceId
  );
  const device = devices.find((dev) => dev.id === editingDeviceId);
  const dispatch = useAppDispatch();
  const isSettingsModalOpen = useAppSelector(
    (state: RootState) => state.ui.isSettingsModalOpen
  );
  const isProfilePageModalOpen = useAppSelector(
    (state: RootState) => state.ui.isProfilePageModalOpen
  );
  const isAddNewPageModalOpen = useAppSelector(
    (state: RootState) => state.ui.isAddNewPageModalOpen
  );
  const isRemoveDevicePageOpen = useAppSelector(
    (state: RootState) => state.ui.isRemoveDevicePageOpen
  );
  const isMetricsPageOpen = useAppSelector(
    (state: RootState) => state.ui.isMetricsPageOpen
  );
  const metricsDeviceId = useAppSelector(
    (state: RootState) => state.ui.metricsDeviceId
  );
  const device2 = devices.find((dev) => dev.id === metricsDeviceId);
  let nameArray: string[];
  let name: string = "";
  if (currentUser) {
    nameArray = currentUser.displayName!.split(" ");

    if (nameArray.length <= 2) {
      name = nameArray.join(" ");
    }
    name = `${nameArray[0]} ${nameArray[1]}`;
  }
  function handleOpenModal() {
    if (!currentUser) {
      dispatch(openSettingsModal());
    } else if (currentUser) {
      dispatch(openProfilePageModal());
    }
  }
  function handleCloseAddPage() {
    dispatch(closeAddNewPageModal());
  }
  function handleCloseModal() {
    if (!currentUser) {
      dispatch(closeSettingsModal());
    } else if (currentUser) {
      dispatch(closeProfilePageModal());
    }
  }
  function handleOpenEditPage() {
    dispatch(closeEditPage());
  }
  function handleCloseRemovePage() {
    dispatch(closeRemoveDevicePage());
  }
  function handleCloseMetricsPage() {
    dispatch(closeMetricsPage());
  }
  let content;
  if (!currentUser) {
    content = (
      <>
        <img src={notifLogo} alt="notif" />
        <span className={styles.btnContainer}>
          <button className={styles.btnSettings} onClick={handleOpenModal}>
            Settings
          </button>
          <img src={arrowDownLogo} alt="arrow" />
        </span>
      </>
    );
  } else {
    content = (
      <>
        <img src={notifications} alt="notif" />
        <span className={styles.btnContainer}>
          <img
            className={styles.imgProfile}
            src={currentUser.photoURL || undefined}
          />
          <button className={styles.btnSettings} onClick={handleOpenModal}>
            {name}
          </button>
          <img src={arrowDownLogo} alt="arrow" />
        </span>
      </>
    );
  }
  if (isMobile) {
    content = "";
  }
  return (
    <div className={styles.containerProfile}>
      {content}
      {isSettingsModalOpen &&
        createPortal(<Settings onClose={handleCloseModal} />, document.body)}
      {isProfilePageModalOpen &&
        createPortal(<ProfilePage onClose={handleCloseModal} />, document.body)}
      {isAddNewPageModalOpen &&
        createPortal(<AddNew onClose={handleCloseAddPage} />, document.body)}
      {isEditPageOpen &&
        createPortal(
          <EditDeviceWrapper onClose={handleOpenEditPage} />,
          document.body
        )}
      {isRemoveDevicePageOpen &&
        editingDeviceId &&
        createPortal(
          <RemoveDevice onClose={handleCloseRemovePage} device={device} />,
          document.body
        )}
      {isRemoveDevicePageOpen &&
        !editingDeviceId &&
        createPortal(
          <RemoveDevice onClose={handleCloseRemovePage} device={device2} />,
          document.body
        )}
      {isMetricsPageOpen &&
        createPortal(
          <DeviceMetrics onClose={handleCloseMetricsPage} />,
          document.body
        )}
    </div>
  );
}
