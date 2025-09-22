import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Clusterizare from "./Clusterizare";

describe("Clusterizare component", () => {
  test('"Voronoi clasterization" should appear', () => {
    render(<Clusterizare />);

    const textElement = screen.getByText(/Voronoi clasterization/i);
    expect(textElement).toBeInTheDocument();
  });

  test("It should have a checkbox input", () => {
    render(<Clusterizare />);
    const checkboxElement = screen.getByRole("checkbox");
    expect(checkboxElement).toBeInTheDocument();
  });
  test("It should have the correct CSS classes", () => {
    render(<Clusterizare />);

    const clusterizareSpan = screen.getByText(
      "Voronoi clasterization"
    ).parentElement;
    expect(clusterizareSpan).toHaveClass("clusterizare");

    const checkboxInput = screen.getByRole("checkbox");
    const switchLabel = checkboxInput.parentElement;
    expect(switchLabel).toHaveClass("switch");

    const sliderSpan = screen.getByRole("checkbox").nextElementSibling;
    expect(sliderSpan).toHaveClass("slider", "round");
  });
});
