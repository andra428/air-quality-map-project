import styles2 from "./AddNew.module.css";
import successIcon from "../assets/iconSuccess.svg";
import errorIcon from "../assets/errorIcon.svg";
interface MessageProps {
  message: string | null;
  messageType: "success" | "error" | null;
}

export default function Message({ message, messageType }: MessageProps) {
  const icon = messageType === "success" ? successIcon : errorIcon;
  const containerClass =
    messageType === "success" ? styles2.messageSuccess : styles2.messageError;

  return (
    <div className={`${styles2.messageContainer} ${containerClass}`}>
      <img src={icon} alt="icon" />
      <span className={styles2.textMessage}>{message}</span>
      {messageType === "error" && (
        <button className={styles2.btnError}>Try again</button>
      )}
    </div>
  );
}
