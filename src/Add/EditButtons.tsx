import styles2 from "./AddNew.module.css";
import deleteIcon from "../assets/delete.svg";
import { FormEvent } from "react";

interface EditButtonsProps {
  onClose: () => void;
  onRemove: () => void;
  onEdit: (event: FormEvent) => void;
}
export default function EditButtons({
  onClose,
  onRemove,
  onEdit,
}: EditButtonsProps) {
  return (
    <div>
      <div className={`${styles2.btnEditContainer} ${styles2.mbsm}`}>
        <button className={styles2.btnAddNew} onClick={onClose}>
          Cancel
        </button>
        <button className={styles2.btnAddNewActive} onClick={onEdit}>
          Edit
        </button>
      </div>
      <button className={styles2.btnRemoveContainer} onClick={onRemove}>
        <img src={deleteIcon} alt="delIcon" />
        <span>Remove device</span>
      </button>
    </div>
  );
}
