import styles from "./Profile.module.css";
import close from "../assets/x.svg";
import settings from "../assets/settings.svg";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { signInWithGoogle } from "../Auth/authSlice";
import type { RootState } from "../store/store";
import { useState } from "react";
import { createPortal } from "react-dom";
import AboutModal from "./AboutModal";
import { useIsMobile } from "../hooks/useMediaQuery";
import notifLogo from "../assets/notif.svg";
import notifications from "../assets/notifications.svg";
import back from "../assets/back.svg";
interface SettingsProps {
  onClose: () => void;
}
export default function Settings({ onClose }: SettingsProps) {
  const isMobile = useIsMobile();
  const currentUser = useAppSelector(
    (state: RootState) => state.auth.currentUser
  );
  const dispatch = useAppDispatch();
  const [showAbout, setShowAbout] = useState<boolean>(false);
  async function handleSignIn() {
    if (!currentUser) {
      await dispatch(signInWithGoogle());
      onClose();
    } else {
      onClose();
    }
  }
  function handleClose() {
    onClose();
  }
  function handleAboutClick() {
    setShowAbout((prevState) => !prevState);
  }
  let content;
  if (isMobile && currentUser) {
    content = (
      <span className={styles.heading}>
        <span className={styles.headingCombined}>
          <button className={styles.btnClose} onClick={handleClose}>
            <img src={back} alt="back" />
          </button>
          <h2>Settings</h2>
        </span>
        <img src={notifications} alt="notifications" />
      </span>
    );
  } else if (isMobile && !currentUser) {
    content = (
      <span className={styles.heading}>
        <span className={styles.headingCombined}>
          <button className={styles.btnClose} onClick={handleClose}>
            <img src={back} alt="back" />
          </button>
          <h2>Settings</h2>
        </span>
        <img src={notifLogo} alt="notifLogo" />
      </span>
    );
  } else {
    content = (
      <span className={styles.heading}>
        <h2>Settings</h2>
        <button className={styles.btnClose} onClick={handleClose}>
          <img src={close} alt="x" />
        </button>
      </span>
    );
  }
  return (
    <>
      <div className={styles.modalOverlay}>
        {content}
        <img className={styles.settingsImg} src={settings} alt="settings" />
        <p className={styles.paragraphLogin}>
          Please Log In via Gmail SSO account to have possibility to manage
          personal devices and recieve notifications.
        </p>
        <button className={styles.btnSignIn} onClick={handleSignIn}>
          Sign in
        </button>
        <button className={styles.btnAbout} onClick={handleAboutClick}>
          About this aplication &rarr;
        </button>
      </div>
      {showAbout &&
        createPortal(
          <AboutModal onClose={() => setShowAbout(false)} />,
          document.body
        )}
    </>
  );
}
