import searchLogo from "../assets/search.svg";
import loopLogo from "../assets/loop.svg";
import styles from "./Header.module.css";
import { useAppSelector } from "../hooks/useAppSelector";
import { RootState } from "../store/store";
import { ChangeEvent, useEffect, useState } from "react";
import { DeviceData, setSelectedDevice } from "../Auth/deviceSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
export default function SearchBar() {
  const devices = useAppSelector((state: RootState) => state.device.devices);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<DeviceData[]>([]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (searchTerm.trim() === "" || !searchTerm) {
      setSearchResults([]);
      return;
    }
    const searchLower = searchTerm.toLowerCase();
    const results = devices.filter(
      (device) =>
        device.deviceName.toLowerCase().includes(searchLower) ||
        device.deviceAddress.toLowerCase().includes(searchLower)
    );
    const resultsLimit = results.slice(0, 200);
    setSearchResults(resultsLimit);
  }, [searchTerm]);

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target?.value);
  }
  function handleClickDevice(device: DeviceData) {
    dispatch(setSelectedDevice(device));
    setSearchTerm("");
    setSearchResults([]);
  }
  return (
    <div className={styles.searchListContainer}>
      <div className={styles.container}>
        <img className={styles.svg} src={searchLogo} alt="search" />
        <input
          className={styles.input}
          type="text"
          placeholder="Type address..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e)}
        />
        <img className={styles.svg2} src={loopLogo} alt="loop" />
      </div>

      {searchResults.length > 0 && (
        <ul className={styles.searchList}>
          {searchResults.map((device) => (
            <li
              key={device.id}
              className={styles.searchItem}
              onClick={() => handleClickDevice(device)}
            >
              <span>{device.deviceName},</span>
              <span className={styles.searchLocation}>
                {device.deviceAddress}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
