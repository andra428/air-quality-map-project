import { useUserDevices } from "../hooks/useUserDevices";
import styles2 from "./AddNew.module.css";
import Device from "./Device";
export default function Devices() {
  const devices = useUserDevices();
  let content;
  if (devices.length > 0) {
    content = (
      <ul className={styles2.deviceList}>
        {devices.map((device) => (
          <li className={styles2.device} key={device.id}>
            <Device device={device} />
          </li>
        ))}
      </ul>
    );
  } else {
    content = <></>;
  }
  return content;
}
