import { renderHook, waitFor, act } from "@testing-library/react";
import { useMediaQuery } from "./useMediaQuery";

describe("useMediaQuery", () => {
  const mockMatchMedia = (matches: boolean) => ({
    matches,
    media: "",
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn((event, handler) => {
      if (event === "change") {
        (mockMatchMedia as any).handler = handler;
      }
    }),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });

  const fireMediaQueryChange = (matches: boolean) => {
    const handler = (mockMatchMedia as any).handler;
    if (handler) {
      act(() => {
        handler({ matches });
      });
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return the initial value correctly", () => {
    window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia(false));
    const { result } = renderHook(() => useMediaQuery("(max-width: 570px)"));
    expect(result.current).toBe(false);
  });

  test("should update the value on media query change", async () => {
    window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia(false));
    const { result } = renderHook(() => useMediaQuery("(max-width: 570px)"));
    fireMediaQueryChange(true);
    await waitFor(() => expect(result.current).toBe(true));
  });

  test("should clean up the event listener on unmount", () => {
    const mock = mockMatchMedia(true);
    window.matchMedia = jest.fn().mockReturnValue(mock);
    const { unmount } = renderHook(() => useMediaQuery("(max-width: 570px)"));
    unmount();
    expect(mock.removeEventListener).toHaveBeenCalled();
  });
});
