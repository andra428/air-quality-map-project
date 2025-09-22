import { render, screen } from "@testing-library/react";
import AirQualityMetricPM25 from "./AirQualityMetricPM25";
import "@testing-library/jest-dom";

describe("AirQualityMetricPM25 component", () => {
  test.each`
    pm25   | expectedColor
    ${5}   | ${"#20944E"}
    ${20}  | ${"#f0e84eff"}
    ${50}  | ${"#FFC700"}
    ${100} | ${"#FF5C00"}
    ${200} | ${"#936496"}
    ${300} | ${"#495057"}
  `(
    "AirQualityMetricPM25 component renders PM2.5 value pm25 with correct color",
    ({ pm25, expectedColor }) => {
      render(<AirQualityMetricPM25 pm25={pm25} />);

      const valueDiv = screen.getByText(pm25.toString());
      expect(valueDiv).toBeInTheDocument();
      expect(valueDiv).toHaveTextContent(pm25.toString());
      expect(valueDiv).toHaveStyle(`color: ${expectedColor}`);
      const labelDiv = screen.getByText("PM2.5");
      expect(labelDiv).toBeInTheDocument();
    }
  );
  test.each`
    pm25   | expectedPercent
    ${0}   | ${0}
    ${125} | ${(125 / 250.5) * 100}
    ${250} | ${(250 / 250.5) * 100}
  `(
    "AirQualityMetricPM25 component should have correct pm25 percentage for pm25 value in outerCircle",
    ({ pm25, expectedPercent }) => {
      render(<AirQualityMetricPM25 pm25={pm25} />);
      const outerCircle = document.querySelector(`.${"outerCircle"}`);
      expect(outerCircle).toBeInTheDocument();
      const style = outerCircle!.getAttribute("style") || "";
      expect(style).toContain(`${expectedPercent}`);
    }
  );

  test("AirQualityMetricPM25 component renders PM2.5 in a circle", () => {
    render(<AirQualityMetricPM25 pm25={50} />);

    const outerCircle = document.querySelector(`.${"outerCircle"}`);
    const innerCircle = document.querySelector(`.${"innerCircle"}`);
    expect(outerCircle).toBeInTheDocument();
    expect(innerCircle).toBeInTheDocument();
  });
});
