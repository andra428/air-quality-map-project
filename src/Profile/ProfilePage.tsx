import styles from "./Profile.module.css";
import privacy from "../assets/privacy.svg";
import logout from "../assets/logout.svg";
import notifications from "../assets/notifications.svg";
import { useIsMobile } from "../hooks/useMediaQuery";
import back from "../assets/back.svg";
import x from "../assets/x.svg";
import Clusterizare from "../Header/Clusterizare";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { handleSignOut } from "../Auth/authSlice";
import type { RootState } from "../store/store";
import { openAddNewPageModal } from "../Auth/uiSlice";
import Devices from "../Add/Devices";

interface ProfilePgeProps {
  onClose: () => void;
}

export default function ProfilePage({ onClose }: ProfilePgeProps) {
  const isMobile = useIsMobile();

  let nameArray: string[];
  let emailArray: string[];
  let name: string = "";
  let email: string = "";
  const currentUser = useAppSelector(
    (state: RootState) => state.auth.currentUser
  );

  const dispatch = useAppDispatch();
  if (currentUser) {
    nameArray = currentUser.displayName!.split(" ");
    emailArray = currentUser.email!.split("@");
    email = "@" + emailArray[0];
    if (nameArray.length <= 2) {
      name = nameArray.join(" ");
    }
    name = `${nameArray[0]} ${nameArray[1]}`;
  }
  function handleLogOut() {
    if (currentUser) {
      dispatch(handleSignOut());
      onClose();
    }
  }

  function handlePrivacyDetails() {
    window.open("https://gdpr-info.eu/", "_blank");
  }

  function handleAddNewPageModal() {
    if (currentUser) {
      dispatch(openAddNewPageModal());
    }
  }
  let content;
  if (isMobile && currentUser) {
    content = (
      <span className={styles.heading}>
        <span className={styles.headingCombined}>
          <button className={styles.btnClose} onClick={onClose}>
            <img src={back} alt="back" />
          </button>
          <h2>Settings</h2>
        </span>
        <img src={notifications} alt="notifications" />
      </span>
    );
  } else if (!isMobile && currentUser) {
    content = (
      <span className={styles.headingX}>
        <button className={styles.btnClose} onClick={onClose}>
          <img src={x} alt="x" />
        </button>
      </span>
    );
  }

  return (
    <>
      <div className={styles.modalProfile}>
        {currentUser && (
          <>
            {content}
            <div className={styles.profileContainer}>
              <span className={styles.profileDetails}>
                <img
                  className={styles.imgProfileBigger}
                  src={currentUser.photoURL || undefined}
                  alt="photo"
                />
                <span className={styles.profileName}>
                  <span className={styles.displayName}>{name}</span>
                  <span>{email}</span>
                </span>
              </span>

              <Devices />

              <button className={styles.btnAdd} onClick={handleAddNewPageModal}>
                + Add new
              </button>
              {isMobile && <Clusterizare />}
              <span className={styles.containerProfileButtons}>
                <button
                  className={styles.privacyContainer}
                  onClick={handlePrivacyDetails}
                >
                  <img
                    src={privacy}
                    alt="privacy"
                    className={styles.privacyIcon}
                  />
                  Privacy
                </button>
                <button
                  className={styles.privacyContainer}
                  onClick={handleLogOut}
                >
                  <img
                    src={logout}
                    alt="signOut"
                    className={styles.signOutIcon}
                  />
                  Sign Out
                </button>
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
}
