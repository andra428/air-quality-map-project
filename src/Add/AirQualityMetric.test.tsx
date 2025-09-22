import { render, screen } from "@testing-library/react";
import AirQualityMetric from "./AirQualityMetric";
import "@testing-library/jest-dom";
describe("AirQualityMetric component", () => {
  test("AirQualityMetric component renders temperature with unit °C", () => {
    render(
      <AirQualityMetric value={12} type="temp">
        Temperature
      </AirQualityMetric>
    );

    expect(screen.getByText("Temperature")).toBeInTheDocument();
    expect(screen.getByText(/12\.0/)).toHaveTextContent("12.0°C");
  });

  test("AirQualityMetric component renders CO2 (1200) without unit and correct color", () => {
    render(
      <AirQualityMetric value={1200} type="co2">
        CO2
      </AirQualityMetric>
    );

    expect(screen.getByText("CO2")).toBeInTheDocument();
    expect(screen.getByText(/1200\.0/)).not.toHaveTextContent("°C");
    const valueDiv = screen.getByText(/1200\.0/);
    expect(valueDiv).toBeInTheDocument();
    expect(valueDiv).toHaveTextContent("1200.0");
    expect(valueDiv).toHaveStyle("color: #FFC700");
  });
  test("AirQualityMetric component should render temperature (5) with correct color", () => {
    render(
      <AirQualityMetric value={5} type="temp">
        Temperature
      </AirQualityMetric>
    );

    const valueDiv = screen.getByText(/5\.0/);
    expect(valueDiv).toBeInTheDocument();
    expect(valueDiv).toHaveTextContent("5.0°C");
    expect(valueDiv).toHaveStyle("color: #ACF254");
  });
});
