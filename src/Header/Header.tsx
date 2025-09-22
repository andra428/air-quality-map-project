import logoGD from "../assets/logo.svg";
import SearchBar from "./SearchBar";
import styles from "./Header.module.css";
import Profile from "../Profile/Profile";
import Clusterizare from "./Clusterizare";
import { useIsMobile } from "../hooks/useMediaQuery";

export default function Header() {
  const isMobile = useIsMobile();
  return (
    <div className={styles.bigLogoContainer}>
      <img className={styles.imgBigLogo} src={logoGD} alt="logoGD" />
      <div className={styles.containerSearch}>
        {!isMobile && <Clusterizare />}
        <SearchBar />
      </div>

      <Profile />
    </div>
  );
}
