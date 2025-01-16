import { useState } from "react";

export function useGeoLocation() {
    const [position, setPosition] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    function getLocation() {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setPosition([latitude, longitude]);
                setIsLoading(false);
            },
            (error) => {
                setError(error.message);
                setIsLoading(false);
            }
        );
    }

    return { position, isLoading, error, getLocation };
}
