import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import CombinedControls from "./CombinedControls";
import LogoControl from "./LogoControl";
import "../App.css";
import PositionControl from "./PositionControl";
import { useIsMobile } from "../hooks/useMediaQuery";
import { useAppSelector } from "../hooks/useAppSelector";
import type { RootState } from "../store/store";
import { useRef, useEffect } from "react";
import Device from "../Add/Device";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Map() {
  const position: [number, number] = [44.787197, 20.457273] as [number, number];
  const mapRef = useRef<L.Map | null>(null);
  const isMobile = useIsMobile();
  const currentUser = useAppSelector(
    (state: RootState) => state.auth.currentUser
  );

  const devices = useAppSelector((state: RootState) => state.device.devices);
  const currentUserDivices = devices.filter(
    (device) => device.userId === currentUser?.uid
  );
  const selectedDevice = useAppSelector(
    (state: RootState) => state.device.selectedDevice
  );

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      if (selectedDevice) {
        map.setView([selectedDevice.deviceLat, selectedDevice.deviceLong], 13);
      } else if (devices.length > 0) {
        map.setView(
          [currentUserDivices[0].deviceLat, currentUserDivices[0].deviceLong],
          13
        );
      } else {
        map.setView(position, 13);
      }
    }
  }, [devices, position, selectedDevice]);
  return (
    <>
      <MapContainer
        center={position}
        zoom={13}
        zoomControl={false}
        className="mapArea"
        ref={mapRef}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {devices.length > 0 &&
          devices.map((device) => (
            <Marker
              key={device.id}
              position={[device.deviceLat, device.deviceLong]}
            >
              <Popup>
                <Device device={device} />
              </Popup>
            </Marker>
          ))}

        {isMobile ? (
          <PositionControl position="topright" />
        ) : (
          <>
            <CombinedControls position="topleft" />
            <LogoControl position="bottomleft" />
          </>
        )}
      </MapContainer>
    </>
  );
}
