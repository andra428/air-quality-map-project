import { useEffect } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { setDevices } from "../Auth/deviceSlice";
import { useAppSelector } from "./useAppSelector";
import type { RootState } from "../store/store";
import { getDocuments } from "../Add/CollectionOperations";
interface DeviceData {
  id: string;
  userName: string;
  userEmail: string;
  userId: string;
  deviceName: string;
  deviceLat: number;
  deviceLong: number;
  deviceAddress: string;
  description: string;
}

export function useInitializeDevices() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(
    (state: RootState) => state.auth.currentUser
  );
  useEffect(() => {
    const getAllDevices = async () => {
      try {
        const devicesData: DeviceData[] = await getDocuments();
        dispatch(setDevices(devicesData));
      } catch (e) {
        dispatch(setDevices([]));
        console.log("Could not get the documents ");
      }
    };
    getAllDevices();
  }, [dispatch, currentUser]);
}
