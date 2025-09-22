import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  isSettingsModalOpen: boolean;
  isProfilePageModalOpen: boolean;
  isAddNewPageModalOpen: boolean;
  isMessagePageOpen: boolean;
  isEditPageOpen: boolean;
  editingDeviceId: string | null;
  messageText: string | null;
  messageType: "success" | "error" | null;
  isRemoveDevicePageOpen: boolean;
  isMetricsPageOpen: boolean;
  metricsDeviceId: string | null;
  lastDeviceId: string | null;
}

const initialState: UiState = {
  isSettingsModalOpen: false,
  isProfilePageModalOpen: false,
  isAddNewPageModalOpen: false,
  isMessagePageOpen: false,
  isEditPageOpen: false,
  editingDeviceId: null,
  messageText: null,
  messageType: null,
  isRemoveDevicePageOpen: false,
  isMetricsPageOpen: false,
  metricsDeviceId: null,
  lastDeviceId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openSettingsModal(state) {
      state.isSettingsModalOpen = true;
    },
    closeSettingsModal(state) {
      state.isSettingsModalOpen = false;
    },
    openProfilePageModal(state) {
      state.isProfilePageModalOpen = true;
    },
    closeProfilePageModal(state) {
      state.isProfilePageModalOpen = false;
    },
    openAddNewPageModal(state) {
      state.isAddNewPageModalOpen = true;
    },
    closeAddNewPageModal(state) {
      state.isAddNewPageModalOpen = false;
    },
    openEditPage(state, action: PayloadAction<string>) {
      state.isEditPageOpen = true;
      state.editingDeviceId = action.payload;
    },
    closeEditPage(state) {
      state.isEditPageOpen = false;
      state.editingDeviceId = null;
    },
    openMessagePageModal(
      state,
      action: PayloadAction<{ text: string; type: "success" | "error" }>
    ) {
      state.isMessagePageOpen = true;
      state.messageText = action.payload.text;
      state.messageType = action.payload.type;
    },
    closeMessagePageModal(state) {
      state.isMessagePageOpen = false;
      state.messageText = null;
      state.messageType = null;
    },
    openRemoveDevicePage(state) {
      state.isRemoveDevicePageOpen = true;
    },
    closeRemoveDevicePage(state) {
      state.isRemoveDevicePageOpen = false;
    },
    openMetricsPage(state, action: PayloadAction<string>) {
      state.isMetricsPageOpen = true;
      state.metricsDeviceId = action.payload;
    },
    closeMetricsPage(state) {
      state.isMetricsPageOpen = false;
      state.lastDeviceId = state.metricsDeviceId;
      state.metricsDeviceId = null;
    },
  },
});

export const {
  openSettingsModal,
  closeSettingsModal,
  openProfilePageModal,
  closeProfilePageModal,
  openAddNewPageModal,
  closeAddNewPageModal,
  openMessagePageModal,
  closeMessagePageModal,
  openEditPage,
  closeEditPage,
  openRemoveDevicePage,
  closeRemoveDevicePage,
  openMetricsPage,
  closeMetricsPage,
} = uiSlice.actions;

export default uiSlice.reducer;
