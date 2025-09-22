import { render } from "@testing-library/react";
import GradientSVG from "./GradientSVG";
import "@testing-library/jest-dom";
describe("GradientSVG component", () => {
  test("renders green gradient when ratio <= 0.8", () => {
    const { container } = render(
      <GradientSVG id="gradient-pm25" value={4} max={10} />
    );
    const stops = container.querySelectorAll("stop");
    expect(stops[0]).toHaveAttribute("stop-color", "#3E8525");
    expect(stops[1]).toHaveAttribute("stop-color", "#aadf7cff");
  });

  test("renders orange gradient when 0.8 < ratio <= 1.0", () => {
    const { container } = render(
      <GradientSVG id="gradient-pm25" value={9} max={10} />
    );
    const stops = container.querySelectorAll("stop");
    expect(stops[0]).toHaveAttribute("stop-color", "#FFA500");
    expect(stops[1]).toHaveAttribute("stop-color", "#ff9900ff");
  });

  test("renders red gradient when ratio > 1.0", () => {
    const { container } = render(
      <GradientSVG id="gradient-pm25" value={6} max={5} />
    );
    const stops = container.querySelectorAll("stop");
    expect(stops[0]).toHaveAttribute("stop-color", "#ff9900ff");
    expect(stops[1]).toHaveAttribute("stop-color", "#ba0000ff");
  });
  test("linearGradient has correct id", () => {
    const { container } = render(
      <GradientSVG id="gradient-test" value={5} max={10} />
    );
    const gradient = container.querySelector("linearGradient");
    expect(gradient).toHaveAttribute("id", "gradient-test");
  });
});
