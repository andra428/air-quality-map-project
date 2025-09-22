import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import Message from "./Message";
import { createPortal } from "react-dom";
import { closeMessagePageModal } from "../Auth/uiSlice";

export default function MessageWrapper() {
  const { isMessagePageOpen, messageText, messageType } = useAppSelector(
    (state) => state.ui
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isMessagePageOpen) {
      const timer = setTimeout(() => {
        dispatch(closeMessagePageModal());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isMessagePageOpen, dispatch]);

  if (!isMessagePageOpen || !messageText) {
    return null;
  }

  return createPortal(
    <Message message={messageText} messageType={messageType} />,
    document.body
  );
}
