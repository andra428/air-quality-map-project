import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DeviceData {
  userName: string;
  userEmail: string;
  userId: string;
  id: string;
  deviceName: string;
  deviceLat: number;
  deviceLong: number;
  deviceAddress: string;
  description: string;
}

interface DevicesState {
  devices: DeviceData[];
  selectedDevice: DeviceData | null;
}

const initialState: DevicesState = {
  devices: [],
  selectedDevice: null,
};

const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    setDevices(state, action: PayloadAction<DeviceData[]>) {
      state.devices = action.payload;
    },
    addDevice(state, action: PayloadAction<DeviceData>) {
      state.devices.push(action.payload);
    },
    updateDevice(state, action: PayloadAction<Partial<DeviceData>>) {
      const deviceIdx = state.devices.findIndex(
        (device) => device.id === action.payload.id
      );
      if (deviceIdx != -1) {
        const updatedDevice = {
          ...state.devices[deviceIdx],
          ...action.payload,
        };
        state.devices[deviceIdx] = updatedDevice;
      }
    },
    setSelectedDevice(state, action: PayloadAction<DeviceData | null>) {
      state.selectedDevice = action.payload;
    },
  },
});

export const { setDevices, addDevice, updateDevice, setSelectedDevice } =
  devicesSlice.actions;
export default devicesSlice.reducer;
