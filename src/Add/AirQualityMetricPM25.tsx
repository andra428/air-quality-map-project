import styles from "./AirQualityMetrics.module.css";
interface AirQualityMetricPM25Props {
  pm25: number;
}

export default function AirQualityMetricPM25({
  pm25,
}: AirQualityMetricPM25Props) {
  function getColorPm25(value: number): string {
    if (value <= 12.0) {
      return "#20944E";
    } else if (value <= 35.4) {
      return "#f0e84eff";
    } else if (value <= 55.4) {
      return "#FFC700";
    } else if (value <= 150.4) {
      return "#FF5C00";
    } else if (value <= 250.4) {
      return "#936496";
    } else {
      return "#495057";
    }
  }
  const fillColor = getColorPm25(pm25);
  const maxPm25 = 250.5;
  const pm25Percentage = (pm25 / maxPm25) * 100;
  return (
    <div className={styles.circleContainer}>
      <div
        className={styles.outerCircle}
        style={{
          background: `conic-gradient(${fillColor} ${pm25Percentage}%, #495057 0%)`,
        }}
      >
        <div className={styles.innerCircle}>
          <div className={styles.content}>
            <div className={styles.value} style={{ color: fillColor }}>
              {pm25}
            </div>
            <div className={styles.label}>PM2.5</div>
          </div>
        </div>
      </div>
    </div>
  );
}
