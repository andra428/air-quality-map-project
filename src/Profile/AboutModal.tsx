import styles from "./Profile.module.css";
import gridLogo from "../assets/logo2.svg";
import byGD from "../assets/byGD.svg";
import out from "../assets/out.svg";
import x from "../assets/x.svg";
interface AboutModalProps {
  onClose: () => void;
}
export default function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div className={styles.aboutModalOverlay}>
      <div className={styles.aboutContainer}>
        <button onClick={onClose} className={styles.btnCloseX}>
          <img src={x} alt="x" />
        </button>
        <span className={styles.aboutContainerContent}>
          <span className={styles.topHeading}>
            <span className={styles.groupLogo}>
              <img src={gridLogo} alt="gd" />
              <img src={byGD} alt="byGD" />
            </span>
            <img src={out} alt="out" />
          </span>
          <h2 className={styles.title}>Hi there!</h2>
          <span className={styles.text}>
            <p>
              Let us introduce the AIRO by Grid Dynamics-the application's ready
              to share with you the overall and parametrical information about
              the air condition in the selected area.
            </p>
            <p>
              It is the platform for collaboration. Users could add their own
              devices to share air condition statistics in their areas with
              other people.
            </p>
            <p>
              The goal of the application is to highlight the condition of our
              common environment and think about where we are now and what we
              would bring to new generations.
            </p>
          </span>
        </span>
        <button className={styles.btnSignIn} onClick={onClose}>
          Ok, got it!
        </button>
      </div>
    </div>
  );
}
