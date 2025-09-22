import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MetricSelect from "./MetricSelect";

describe("MetricSelect component", () => {
  test("renders the default option text", () => {
    render(<MetricSelect>Pressure</MetricSelect>);

    const optionElement = screen.getByRole("option", {
      name: /Select metrics/i,
    });

    expect(optionElement).toBeInTheDocument();
  });
  test("renders the label and disabled select", () => {
    render(<MetricSelect>Test Label</MetricSelect>);

    expect(screen.getByText("Test Label")).toBeInTheDocument();

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();

    expect(selectElement).toBeDisabled();
    expect(screen.getByText("Select metrics")).toBeInTheDocument();
  });
  test("renders dynamic description text", () => {
    const { rerender } = render(<MetricSelect>First Text</MetricSelect>);
    expect(screen.getByText("First Text")).toBeInTheDocument();

    rerender(<MetricSelect>Second Text</MetricSelect>);
    expect(screen.getByText("Second Text")).toBeInTheDocument();
  });
  test("select has only the default option", () => {
    render(<MetricSelect>Metrics</MetricSelect>);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toBe("Select metrics");
  });
  test("applies correct CSS classes", () => {
    render(<MetricSelect>Metrics</MetricSelect>);
    const container = screen.getByText("Metrics").parentElement;
    expect(container).toHaveClass("inputGateway");

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("selectGateway");
  });
});
