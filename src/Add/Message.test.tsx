import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Message from "./Message";

describe("Message component", () => {
  test("Message component should display try again button when message type is error", () => {
    const message = "Error";
    const messageType = "error";
    render(<Message message={message} messageType={messageType} />);
    const tryBtn = screen.getByRole("button", { name: "Try again" });
    expect(tryBtn).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });
  test("Message component should not display try again button when message type is success and display success message", () => {
    const message = "Success";
    const messageType = "success";
    render(<Message message={message} messageType={messageType} />);
    const tryBtn = screen.queryByRole("button", { name: "Try again" });
    const img = screen.getByRole("img", { name: /icon/i });
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", "icon");
    expect(tryBtn).not.toBeInTheDocument();
  });
  test("Message component does not render anything when message is null", () => {
    render(<Message message={null} messageType={null} />);
    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });
});
