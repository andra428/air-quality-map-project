import uiReducer, {
  openSettingsModal,
  closeSettingsModal,
  openProfilePageModal,
  closeProfilePageModal,
  openAddNewPageModal,
  closeAddNewPageModal,
  openEditPage,
  closeEditPage,
  openMessagePageModal,
  closeMessagePageModal,
  openRemoveDevicePage,
  closeRemoveDevicePage,
  openMetricsPage,
  closeMetricsPage,
} from "./uiSlice";

describe("uiSlice", () => {
  const initialState = {
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

  it("should handle initial state", () => {
    expect(uiReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should open and close settings modal", () => {
    let state = uiReducer(initialState, openSettingsModal());
    expect(state.isSettingsModalOpen).toBe(true);

    state = uiReducer(state, closeSettingsModal());
    expect(state.isSettingsModalOpen).toBe(false);
  });

  it("should open and close profile page modal", () => {
    let state = uiReducer(initialState, openProfilePageModal());
    expect(state.isProfilePageModalOpen).toBe(true);

    state = uiReducer(state, closeProfilePageModal());
    expect(state.isProfilePageModalOpen).toBe(false);
  });

  it("should open and close add new page modal", () => {
    let state = uiReducer(initialState, openAddNewPageModal());
    expect(state.isAddNewPageModalOpen).toBe(true);

    state = uiReducer(state, closeAddNewPageModal());
    expect(state.isAddNewPageModalOpen).toBe(false);
  });

  it("should open and close edit page with device id", () => {
    let state = uiReducer(initialState, openEditPage("1"));
    expect(state.isEditPageOpen).toBe(true);
    expect(state.editingDeviceId).toBe("1");

    state = uiReducer(state, closeEditPage());
    expect(state.isEditPageOpen).toBe(false);
    expect(state.editingDeviceId).toBeNull();
  });

  it("should open and close message page with text and type", () => {
    let state = uiReducer(
      initialState,
      openMessagePageModal({ text: "Success!", type: "success" })
    );
    expect(state.isMessagePageOpen).toBe(true);
    expect(state.messageText).toBe("Success!");
    expect(state.messageType).toBe("success");

    state = uiReducer(state, closeMessagePageModal());
    expect(state.isMessagePageOpen).toBe(false);
    expect(state.messageText).toBeNull();
    expect(state.messageType).toBeNull();
  });

  it("should open and close remove device page", () => {
    let state = uiReducer(initialState, openRemoveDevicePage());
    expect(state.isRemoveDevicePageOpen).toBe(true);

    state = uiReducer(state, closeRemoveDevicePage());
    expect(state.isRemoveDevicePageOpen).toBe(false);
  });

  it("should open and close metrics page and set lastDeviceId", () => {
    let state = uiReducer(initialState, openMetricsPage("1"));
    expect(state.isMetricsPageOpen).toBe(true);
    expect(state.metricsDeviceId).toBe("1");

    state = uiReducer(state, closeMetricsPage());
    expect(state.isMetricsPageOpen).toBe(false);
    expect(state.lastDeviceId).toBe("1");
    expect(state.metricsDeviceId).toBeNull();
  });
});
