import styles2 from "./AddNew.module.css";
export default function AddGateway() {
  return (
    <>
      <div className={styles2.inputGateway}>
        <span className={styles2.inputLabel}>Gateway's name</span>
        <input
          className={styles2.inputText}
          placeholder="Gateway"
          type="text"
        />
      </div>
      <div className={styles2.inputGateway}>
        <span className={styles2.inputLabel}>Key</span>
        <textarea className={styles2.textareaStyle} placeholder="Type key" />
      </div>
    </>
  );
}
