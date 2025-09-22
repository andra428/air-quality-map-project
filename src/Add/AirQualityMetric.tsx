import styles from "./AirQualityMetrics.module.css";
interface AirQualityMetricProps {
  value: number;
  children: string;
  type: string;
}

export default function AirQualityMetric({
  value,
  children,
  type,
}: AirQualityMetricProps) {
  let unit = "";
  function getColor(value: number): string[] {
    if (type === "temp") {
      unit = "°C;";
      if (value > 0 && value <= 10) {
        return ["#20944E", "#ACF254"];
      } else if (value > 10 && value <= 25) {
        return ["#FFC700", "#ffe278ff"];
      } else if (value > 25 && value <= 35) {
        return ["#FF5C00", "#FFC700"];
      } else {
        return ["#495057", "#697d90ff"];
      }
    } else if (type === "co2") {
      if (value <= 500.0) {
        return ["#20944E", "#ACF254"];
      } else if (value < 1000 && value > 500) {
        return ["#FFC700", "#ffe278ff"];
      } else if (value >= 1000) {
        return ["#FF5C00", "#FFC700"];
      } else {
        return ["#495057", "#697d90ff"];
      }
    } else {
      if (value > 0 && value <= 100) {
        return ["#20944E", "#ACF254"];
      } else if (value > 100 && value <= 150) {
        return ["#FFC700", "#ffe278ff"];
      } else if (value > 150 && value <= 200) {
        return ["#FF5C00", "#FFC700"];
      } else {
        return ["#495057", "#697d90ff"];
      }
    }
  }
  const fillColor = getColor(value);

  return (
    <div className={styles.rectangleContainer}>
      <div
        className={styles.outerRectangle}
        style={{
          background: `conic-gradient(${fillColor[0]}, ${fillColor[1]})`,
        }}
      >
        <div className={styles.innerRectangle}>
          <div className={styles.content}>
            <div className={styles.label}>{children}</div>
            <div className={styles.value} style={{ color: fillColor[1] }}>
              {value.toFixed(1)}
              {unit}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
