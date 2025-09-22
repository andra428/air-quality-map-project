import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import AboutModal from "./AboutModal";

describe("About modal component", () => {
  test("About modal should close correctly", async () => {
    const mockClose = jest.fn();
    render(<AboutModal onClose={mockClose} />);
    const greetingText = screen.getByText(/Hi there!/i);
    const okText = screen.getByText(/Ok, got it!/i);
    const xBtn = screen.getByAltText("x");
    const okBtn = screen.getByRole("button", { name: /Ok, got it!/i });
    expect(greetingText).toBeInTheDocument();
    expect(okText).toBeInTheDocument();
    expect(xBtn).toBeInTheDocument();
    await userEvent.click(okBtn);
    expect(mockClose).toHaveBeenCalledTimes(1);
    const closeButton = screen.getByRole("button", { name: /x/i });
    await userEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalledTimes(2);
  });
  test("About modal should display all content correctly", () => {
    const mockClose = jest.fn();
    render(<AboutModal onClose={mockClose} />);

    expect(screen.getByText("Hi there!")).toBeInTheDocument();
    expect(
      screen.getByText(/the application's ready to share/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/platform for collaboration/i)).toBeInTheDocument();
    expect(
      screen.getByText(/highlight the condition of our common environment/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Ok, got it!")).toBeInTheDocument();

    expect(screen.getByAltText("gd")).toBeInTheDocument();
    expect(screen.getByAltText("byGD")).toBeInTheDocument();
    expect(screen.getByAltText("out")).toBeInTheDocument();
    expect(screen.getByAltText("x")).toBeInTheDocument();
  });
  test("About modal should have the correct CSS classes applied", () => {
    const mockClose = jest.fn();
    render(<AboutModal onClose={mockClose} />);
    const innerContainer = screen
      .getByText("Hi there!")
      .closest("div") as HTMLDivElement;
    const outerContainer = innerContainer.parentElement;
    expect(outerContainer).toHaveClass("aboutModalOverlay");
    expect(innerContainer).toHaveClass("aboutContainer");
  });
  test("Buttons have correct roles", () => {
    const mockClose = jest.fn();
    render(<AboutModal onClose={mockClose} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });
});
