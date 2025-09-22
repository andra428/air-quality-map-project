import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import logo from "../assets/logogd.svg";

interface LogoControl {
  position?: L.ControlPosition;
}
export default function LogoControl({ position = "topleft" }: LogoControl) {
  const map = useMap();
  useEffect(() => {
    const customCombinedControl = L.Control.extend({
      options: {
        position: position,
      },
      onAdd: function (_map: L.Map) {
        const container = L.DomUtil.create("div", "logo-container");
        const imgLogo = L.DomUtil.create("img", "", container);
        imgLogo.src = logo;
        imgLogo.alt = "logo";
        const text = L.DomUtil.create("span", "", container);
        text.innerHTML = "2025 &copy; All rights reserved.";
        return container;
      },
    });
    const control = new customCombinedControl();
    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, []);
  return null;
}
