import styles from "./Header.module.css";

export default function Clusterizare() {
  return (
    <span className={styles.clusterizare}>
      <span>Voronoi clasterization</span>
      <label className={styles.switch}>
        <input type="checkbox" />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
    </span>
  );
}
