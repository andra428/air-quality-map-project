import styles2 from "./AddNew.module.css";
interface MetricSelectProps {
  children: string;
}

export default function MetricSelect({ children }: MetricSelectProps) {
  return (
    <div className={styles2.inputGateway}>
      <span className={styles2.inputLabel}>{children}</span>
      <select name="gateway" disabled className={styles2.selectGateway}>
        <option value="Gateway">Select metrics</option>
      </select>
    </div>
  );
}
