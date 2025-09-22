import { render, screen } from "@testing-library/react";
import AddNewButtons from "./AddNewButtons";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
describe("AddNewButtons component", () => {
  test("AddNewButtons component should render button texts correctly (gateway button)", () => {
    const mockClose = jest.fn();
    const mockHandleSubmit = jest.fn();
    render(
      <AddNewButtons
        addWord="gateway"
        onClose={mockClose}
        handleSubmit={mockHandleSubmit}
      />
    );
    const addButton = screen.getByRole("button", { name: "Add gateway" });
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(addButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  test("AddNewButtons component should render button texts correctly (device button)", () => {
    const mockClose = jest.fn();
    const mockHandleSubmit = jest.fn();
    render(
      <AddNewButtons
        addWord="device"
        onClose={mockClose}
        handleSubmit={mockHandleSubmit}
      />
    );
    const addButton = screen.getByRole("button", { name: "Add device" });
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(addButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  test("AddNewButtons component should call handleSubmit when clicking Add button", async () => {
    const mockClose = jest.fn();
    const mockHandleSubmit = jest.fn();
    render(
      <AddNewButtons
        addWord="device"
        onClose={mockClose}
        handleSubmit={mockHandleSubmit}
      />
    );
    const addButton = screen.getByRole("button", { name: "Add device" });
    await userEvent.click(addButton);
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  test("AddNewButtons component should call onClose when clicking Cancel", async () => {
    const mockClose = jest.fn();
    const mockHandleSubmit = jest.fn();
    render(
      <AddNewButtons
        addWord="gateway"
        onClose={mockClose}
        handleSubmit={mockHandleSubmit}
      />
    );
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await userEvent.click(cancelButton);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
