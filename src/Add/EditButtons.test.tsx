import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditButtons from "./EditButtons";
import "@testing-library/jest-dom";
describe("EditButtons component", () => {
  test("renders all buttons and icons", () => {
    render(
      <EditButtons
        onClose={jest.fn()}
        onRemove={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Remove device")).toBeInTheDocument();

    expect(screen.getByAltText("delIcon")).toBeInTheDocument();
  });

  test("calls onClose when Cancel button is clicked", async () => {
    const mockClose = jest.fn();
    render(
      <EditButtons
        onClose={mockClose}
        onRemove={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelBtn);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test("calls onEdit when Edit button is clicked", async () => {
    const mockEdit = jest.fn();
    render(
      <EditButtons onClose={jest.fn()} onRemove={jest.fn()} onEdit={mockEdit} />
    );

    const editBtn = screen.getByRole("button", { name: /edit/i });
    await userEvent.click(editBtn);
    expect(mockEdit).toHaveBeenCalledTimes(1);
  });

  test("calls onRemove when Remove device button is clicked", async () => {
    const mockRemove = jest.fn();
    render(
      <EditButtons
        onClose={jest.fn()}
        onRemove={mockRemove}
        onEdit={jest.fn()}
      />
    );

    const removeBtn = screen.getByRole("button", { name: /remove device/i });
    await userEvent.click(removeBtn);
    expect(mockRemove).toHaveBeenCalledTimes(1);
  });
});
