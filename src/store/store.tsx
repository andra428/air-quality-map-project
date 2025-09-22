import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Auth/authSlice";
import uiReducer from "../Auth/uiSlice";
import deviceReducer from "../Auth/deviceSlice";
import metricsReducer from "../Auth/metricsSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    device: deviceReducer,
    metrics: metricsReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
