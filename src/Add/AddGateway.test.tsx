import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddGateway from "./AddGateway";
import "@testing-library/jest-dom";

describe("AddGateway component", () => {
  test("renders the Gateway name input", () => {
    render(<AddGateway />);
    const gatewayInput = screen.getByPlaceholderText("Gateway");
    expect(gatewayInput).toBeInTheDocument();
    expect(gatewayInput).toHaveAttribute("type", "text");
  });

  test("renders the Key textarea", () => {
    render(<AddGateway />);
    const keyTextarea = screen.getByPlaceholderText("Type key");
    expect(keyTextarea).toBeInTheDocument();
    expect(keyTextarea.tagName).toBe("TEXTAREA");
  });

  test("allows typing in both inputs", async () => {
    render(<AddGateway />);
    const gatewayInput = screen.getByPlaceholderText("Gateway");
    const keyTextarea = screen.getByPlaceholderText("Type key");

    await userEvent.type(gatewayInput, "My Gateway");
    await userEvent.type(keyTextarea, "SecretKey123");

    expect(gatewayInput).toHaveValue("My Gateway");
    expect(keyTextarea).toHaveValue("SecretKey123");
  });
  test("inputs have the correct CSS classes", () => {
    render(<AddGateway />);
    const gatewayInput = screen.getByPlaceholderText("Gateway");
    const keyTextarea = screen.getByPlaceholderText("Type key");

    expect(gatewayInput).toHaveClass("inputText");
    expect(keyTextarea).toHaveClass("textareaStyle");
  });
  test("inputs are empty initially", () => {
    render(<AddGateway />);
    expect(screen.getByPlaceholderText("Gateway")).toHaveValue("");
    expect(screen.getByPlaceholderText("Type key")).toHaveValue("");
  });
});
