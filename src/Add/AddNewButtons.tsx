import styles2 from "./AddNew.module.css";

interface AddNewButtonsProps {
  addWord: string;
  onClose: () => void;
  handleSubmit: () => void;
}

export default function AddNewButtons({
  addWord,
  onClose,
  handleSubmit,
}: AddNewButtonsProps) {
  return (
    <div className={styles2.btnContainerDown}>
      <button className={styles2.btnAddNewActive} onClick={handleSubmit}>
        Add {addWord}
      </button>
      <button className={styles2.btnAddNew} onClick={onClose}>
        Cancel
      </button>
    </div>
  );
}
