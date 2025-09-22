import styles2 from "./AddNew.module.css";
import locationPin from "../assets/locationPin.svg";
import { FormEvent, RefObject, useEffect, useState } from "react";
import MetricSelect from "./MetricSelect";
import { useAppSelector } from "../hooks/useAppSelector";
import type { RootState } from "../store/store";
import { saveUserData } from "./CollectionOperations";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { openMessagePageModal, closeAddNewPageModal } from "../Auth/uiSlice";
import { getCoordsFromAddress, getLocation } from "./Location";
import { addDevice } from "../Auth/deviceSlice";
import { Location } from "./Location";
import styles from "./AirQualityMetrics.module.css";
interface AddDeviceProps {
  formRef: RefObject<HTMLFormElement | null>;
}

export default function AddDevice({ formRef }: AddDeviceProps) {
  const [typeValue, setTypeValue] = useState<string>("json");
  const [location, setLocation] = useState<string>("");
  const dispatch = useAppDispatch();
  const [manualSearch, setManualSearch] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [coords, setCoords] = useState({
    lat: 0,
    long: 0,
  });
  const currentUser = useAppSelector(
    (state: RootState) => state.auth.currentUser
  );

  function handleContent(value: string) {
    setTypeValue(value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser || !currentUser.displayName || !currentUser.email) {
      return;
    }
    if (!coords) {
      return;
    }

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const userName = currentUser.displayName;
    const userEmail = currentUser.email;
    const userId = currentUser.uid;
    const deviceName = formData.get("deviceName") as string;
    const description = formData.get("description") as string;
    const locationValue = location;

    if (
      !deviceName ||
      typeof deviceName !== "string" ||
      !description ||
      typeof description !== "string" ||
      !locationValue ||
      locationValue.trim() === "" ||
      !currentUser.displayName ||
      !currentUser.email
    ) {
      alert("Device name, description and location need to be filled");
      return;
    }
    let finalCoords = { lat: 0, long: 0 };
    let finalAddress = "";

    if (selectedLocation) {
      finalCoords = selectedLocation.coords;
      finalAddress = selectedLocation.address;
    } else if (coords.lat !== 0 && coords.long !== 0) {
      finalCoords = coords;
      finalAddress = location;
    } else {
      alert("Please select a location before submitting.");
      return;
    }

    const data = {
      userName: userName,
      userEmail: userEmail,
      userId: userId,
      deviceName: deviceName,
      description: description,
      deviceLat: finalCoords.lat,
      deviceLong: finalCoords.long,
      deviceAddress: finalAddress,
    };
    try {
      const docId = await saveUserData(data);
      if (docId) {
        const newDevice = {
          id: docId,
          ...data,
        };

        dispatch(addDevice(newDevice));
        dispatch(
          openMessagePageModal({
            text: "Success! The device was added.",
            type: "success",
          })
        );
      }
    } catch (error) {
      dispatch(
        openMessagePageModal({
          text: "Oops! The device wasn't added. Try again.",
          type: "error",
        })
      );
      console.log(error);
    }
    dispatch(closeAddNewPageModal());
  }

  async function handleLocate() {
    try {
      const result = await getLocation();

      setLocation(result.address);
      setCoords(result.coords);
      setManualSearch(false);
    } catch (error: any) {
      alert(error.message);
    }
  }

  useEffect(() => {
    if (!location || location.trim() === "") {
      return;
    }
    if (selectedLocation && selectedLocation.address === location) {
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await getCoordsFromAddress(location);
        setSearchResults(results);
        // setSelectedLocation(results[0] || null);
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
    <div className={styles2.deviceContentContainer}>
      <div className={styles2.deviceFirstCol}>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className={styles2.inputGateway}>
            <span className={styles2.inputLabel}>Device's name</span>
            <input
              name="deviceName"
              className={styles2.inputText}
              placeholder="Type name..."
              type="text"
            />
          </div>
          <div className={styles2.inputGateway}>
            <span className={styles2.inputLabel}>Description</span>
            <input
              name="description"
              className={styles2.inputText}
              placeholder="Type description..."
              type="text"
            />
          </div>
          <div className={styles2.inputGateway}>
            <span className={styles2.inputLabel}>Gateway</span>
            <select name="gateway" disabled className={styles2.selectGateway}>
              <option value="Gateway">Gateway</option>
            </select>
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
          </div>
          {manualSearch && searchResults.length > 0 && (
            <ul className={styles.searchLocationList}>
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSelectedLocation(result);
                    setLocation(result.address);
                    setCoords(result.coords);
                    setManualSearch(false);
                    setSearchResults([]);
                  }}
                  className={styles.searchLocationItem}
                >
                  {result.address}
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
      <div className={styles2.deviceFirstCol}>
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
      </div>
    </div>
  );
}
