import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useCities } from "../contexts/CitiesContext";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import styles from "./Map.module.css";
import Button from "./Button";

function Map() {
    const [mapPosition, setMapPosition] = useState([40, 0]);
    const { cities } = useCities();
    const { position, isLoading, getLocation } = useGeoLocation();
    const [mapLat, mapLng] = useUrlPosition();

    useEffect(
        function () {
            if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
        },
        [mapLat, mapLng]
    );

    useEffect(
        function () {
            if (position) setMapPosition(position);
        },
        [position]
    );

    const customMarkerIcon = L.icon({
        iconUrl: "/marker.png",
        iconSize: [40, 40],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],

        shadowUrl: "/marker-shadow.png",
        shadowSize: [50, 50],
        shadowAnchor: [15, 45],
    });

    return (
        <div className={styles.mapContainer}>
            <MapContainer
                center={mapPosition}
                zoom={5}
                scrollWheelZoom={true}
                className={styles.map}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map((city) => (
                    <Marker
                        position={[city.position.lat, city.position.lng]}
                        key={city.id}
                        icon={customMarkerIcon}
                    >
                        <Popup>
                            <span>{city.emoji}</span>
                            <span>{city.cityName}</span>
                        </Popup>
                    </Marker>
                ))}
                <SetViewOnPosition position={mapPosition} />
                <ClickOnMap />
            </MapContainer>
            <Button
                cssClass="position"
                onClick={(e) => {
                    e.preventDefault();
                    getLocation();
                }}
            >
                {isLoading ? "Loading..." : "use your position"}
            </Button>
        </div>
    );
}

// setting the current map view
function SetViewOnPosition({ position }) {
    const map = useMap(); // Giving us the current Map instance that is displayed
    map.setView(position); // Updating map view
    return null;
}

// When clicking on the map
function ClickOnMap() {
    const { setClickMapCount } = useCities();

    const navigate = useNavigate();
    useMapEvents({
        click: (e) => {
            setClickMapCount((count) => count + 1);
            navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
        },
    });
    return null;
}

export default Map;
