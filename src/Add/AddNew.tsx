import styles from "../Profile/Profile.module.css";
import styles2 from "./AddNew.module.css";
import x from "../assets/x.svg";
import { useState, useRef } from "react";
import AddNewButtons from "./AddNewButtons";
import AddGateway from "./AddGateway";
import AddDevice from "./AddDevice";
import { useIsMobile } from "../hooks/useMediaQuery";
import back from "../assets/back.svg";

interface AddNewProps {
  onClose: () => void;
}
export default function AddNew({ onClose }: AddNewProps) {
  const [addNew, setAddNew] = useState<string>("gateway");

  const isMobile = useIsMobile();
  const formRef = useRef<HTMLFormElement>(null);
  function handleFormSubmit() {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }

  let heading;
  if (isMobile) {
    heading = (
      <span className={`${styles2.headingMobile} ${styles.headingCombined}`}>
        <button className={styles.btnClose} onClick={onClose}>
          <img src={back} alt="back" />
        </button>
        <h1 className={styles2.h1}>Add new</h1>
      </span>
    );
  } else {
    heading = (
      <>
        <button onClick={onClose} className={styles.btnCloseX}>
          <img src={x} alt="x" />
        </button>
        <h1 className={styles2.h1}>Add new</h1>
      </>
    );
  }
  function handleContent(content: string) {
    setAddNew(content);
  }
  let content;
  if (addNew === "gateway") {
    content = <AddGateway />;
  } else {
    content = <AddDevice formRef={formRef} />;
  }
  return (
    <>
      <div className={styles.aboutModalOverlay}>
        <div className={styles2.addNewcContainer}>
          {heading}
          <div className={styles2.addNewContent}>
            <div className={styles2.btnContainer}>
              <button
                className={`${styles2.btnAdd} ${
                  addNew === "gateway" ? styles2.btnAddActive : ""
                }`}
                onClick={() => handleContent("gateway")}
              >
                Gateway
              </button>
              <button
                className={`${styles2.btnAdd} ${
                  addNew === "device" ? styles2.btnAddActive : ""
                }`}
                onClick={() => handleContent("device")}
              >
                Device
              </button>
            </div>
            {content}
            <AddNewButtons
              addWord={addNew}
              onClose={onClose}
              handleSubmit={handleFormSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}
