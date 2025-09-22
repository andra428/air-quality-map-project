import { useAppSelector } from "./useAppSelector";
import type { RootState } from "../store/store";

export function useUserDevices() {
  const devices = useAppSelector((state: RootState) => state.device.devices);
  const currentUser = useAppSelector(
    (state: RootState) => state.auth.currentUser
  );

  if (!currentUser) {
    return [];
  }

  return devices.filter((device) => device.userId === currentUser.uid);
}
