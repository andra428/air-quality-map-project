import { RefObject, useState } from "react";
import { useEffect } from "react";
import { DeviceData } from "../Auth/deviceSlice";
import MetricSelect from "./MetricSelect";
import styles2 from "./AddNew.module.css";
import locationPin from "../assets/locationPin.svg";
import { getLocation, getCoordsFromAddress, Location } from "./Location";

interface EditDeviceProps {
  formRef: RefObject<HTMLFormElement | null>;
  device: DeviceData;
  onUpdateCoords: (
    coords: { lat: number; long: number },
    confirmed: boolean
  ) => void;
}
export default function EditDevice({
  formRef,
  device,
  onUpdateCoords,
}: EditDeviceProps) {
  const [typeValue, setTypeValue] = useState<string>("json");
  const [location, setLocation] = useState<string>(device.deviceAddress);
  const [deviceName, setDeviceName] = useState<string>(device.deviceName);
  const [deviceDesc, setDeviceDesc] = useState<string>(device.description);
  const [manualSearch, setManualSearch] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  function handleContent(value: string) {
    setTypeValue(value);
  }
  useEffect(() => {
    setDeviceName(device.deviceName);
    setDeviceDesc(device.description);
    setLocation(device.deviceAddress);
  }, [device]);
  async function handleLocate() {
    try {
      const result = await getLocation();
      setLocation(result.address);
      onUpdateCoords(result.coords, true);
      setManualSearch(false);
    } catch (error: any) {
      alert(error.message);
    }
  }
  useEffect(() => {
    if (!location || location.trim() === "") return;
    if (selectedLocation && selectedLocation.address === location) return;

    const timer = setTimeout(async () => {
      try {
        const results = await getCoordsFromAddress(location);
        setSearchResults(results);
      } catch (error: any) {
        console.log(error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [location, selectedLocation]);

  let content;
  if (typeValue === "json") {
    content = (
      <>
        <MetricSelect> Metrics to be tracked</MetricSelect>
        <MetricSelect> Public metrics</MetricSelect>
      </>
    );
  } else {
    content = <></>;
  }
  return (
    <>
      <form ref={formRef}>
        <div className={styles2.inputGateway}>
          <span className={styles2.inputLabel}>Device's name</span>
          <input
            name="deviceName"
            className={styles2.inputText}
            placeholder="Type name..."
            type="text"
            value={deviceName}
            onChange={(event) => setDeviceName(event?.target.value)}
          />
        </div>
        <div className={styles2.inputGateway}>
          <span className={styles2.inputLabel}>Description</span>
          <input
            name="description"
            className={styles2.inputText}
            placeholder="Type description..."
            type="text"
            value={deviceDesc}
            onChange={(event) => setDeviceDesc(event?.target.value)}
          />
        </div>

        <div className={styles2.inputGateway}>
          <span className={styles2.inputLabel}>Location</span>
          <div className={styles2.inputLocation}>
            <input
              name="location"
              className={styles2.inputTextLocation}
              placeholder="Location..."
              value={location}
              onChange={(event) => {
                setLocation(event.target.value);
                setManualSearch(true);
                onUpdateCoords({ lat: 0, long: 0 }, false);
              }}
              type="text"
            />
            <button
              className={styles2.btnPin}
              onClick={handleLocate}
              type="button"
            >
              <img src={locationPin} alt="locPin" />
            </button>
          </div>
          {manualSearch && searchResults.length > 0 && (
            <ul className={styles2.searchLocationList}>
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSelectedLocation(result);
                    setLocation(result.address);
                    onUpdateCoords(result.coords, true);
                    setManualSearch(false);
                    setSearchResults([]);
                  }}
                  className={styles2.searchLocationItem}
                >
                  {result.address}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>

      <div className={styles2.inputGateway}>
        <span className={styles2.inputLabel}>Data format</span>
        <span className={styles2.btnDataFormatContainer}>
          <button
            className={`${styles2.btnAdd} ${
              typeValue === "json" ? styles2.btnAddActive : ""
            }`}
            onClick={() => handleContent("json")}
          >
            JSON Value
          </button>
          <button
            className={`${styles2.btnAdd} ${
              typeValue === "single" ? styles2.btnAddActive : ""
            }`}
            onClick={() => handleContent("single")}
          >
            Single Value
          </button>
        </span>
      </div>
      {content}
    </>
  );
}
