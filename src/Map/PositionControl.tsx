import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import getCurLoc from "../assets/getLocPng.svg";
import "../App.css";
interface PositionControlProps {
  position?: L.ControlPosition;
}

export default function PositionControl({
  position = "topright",
}: PositionControlProps) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  const handleLocate = () => {
    if (navigator.geolocation) {
      map.locate();
      map.once("locationfound", function (e: L.LocationEvent) {
        map.flyTo(e.latlng, 13);
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        markerRef.current = L.marker(e.latlng)
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();
      });
      map.once("locationerror", function (e: L.ErrorEvent) {
        alert("Geolocation error: " + e.message);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    const customPositionControl = L.Control.extend({
      options: {
        position: position,
      },

      onAdd: function (_map: L.Map) {
        const container = L.DomUtil.create("div", "");

        const locationButton = L.DomUtil.create(
          "button",
          "btn-currPos",
          container
        );
        locationButton.title = "Current Location";

        const img = L.DomUtil.create("img", "img-currPos", locationButton);
        img.src = getCurLoc;
        img.alt = "Current Location";

        L.DomEvent.on(locationButton, "click", L.DomEvent.stop).on(
          locationButton,
          "click",
          handleLocate
        );

        L.DomEvent.disableClickPropagation(container);

        return container;
      },
    });

    const control = new customPositionControl();
    map.addControl(control);

    return () => {
      map.removeControl(control);
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }
    };
  }, [map, position]);

  return null;
}
