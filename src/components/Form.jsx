import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useUrlPosition } from "../hooks/useUrlPosition";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Spinner from "./Spinner";
import Message from "./Message";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function convertToEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
    const [cityName, setCityName] = useState("");
    const [country, setCountry] = useState("");
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState("");
    const [emoji, setEmoji] = useState("");
    const [isLoadingGeoData, setIsLoadingGeoData] = useState(false);
    const [GeoLocationError, setGeoLocationError] = useState("");
    const [lat, lng] = useUrlPosition();
    const { clickMapCount, addNewCity, isLoading } = useCities();
    const navigate = useNavigate();

    useEffect(
        function () {
            async function getCountry() {
                try {
                    setIsLoadingGeoData(true);
                    setGeoLocationError("");
                    const res = await fetch(
                        `${BASE_URL}?latitude=${lat}&longitude=${lng}`
                    );
                    if (!res.ok)
                        throw new Error(
                            "Something went wrong. Please try again later"
                        );
                    const data = await res.json();
                    setCityName(data.city);
                    setCountry(data.countryCode);
                    setEmoji(convertToEmoji(data.countryCode));
                    if (!data.countryCode)
                        throw new Error(
                            "It does not seem to be a city. Please click on another position."
                        );
                } catch (error) {
                    setGeoLocationError(error.message);
                } finally {
                    setIsLoadingGeoData(false);
                }
            }
            if (!lat && !lng) return;
            getCountry();
        },
        [lat, lng]
    );

    async function handleAddCity(e) {
        e.preventDefault();
        if (!cityName || !date) return;
        const newCity = {
            cityName,
            country,
            emoji,
            date,
            notes,
            id: crypto.randomUUID(),
            position: {
                lat,
                lng,
            },
        };
        await addNewCity(newCity);
        navigate("/app/cities");
    }

    if (!lat && !lng)
        return (
            <Message message="Please Start by clicking on the map to select some city." />
        );

    if (isLoadingGeoData) return <Spinner />;

    if (GeoLocationError) return <Message message={GeoLocationError} />;

    return (
        <form
            className={`${styles.form} ${isLoading ? styles.loading : ""}`}
            onSubmit={handleAddCity}
        >
            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input
                    id="cityName"
                    onChange={(e) => setCityName(e.target.value)}
                    value={cityName}
                />
                <span className={styles.flag}>{emoji}</span>
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                <DatePicker
                    id="date"
                    selected={date}
                    onChange={(date) => setDate(date)}
                />
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">
                    Notes about your trip to {cityName}
                </label>
                <textarea
                    id="notes"
                    onChange={(e) => setNotes(e.target.value)}
                    value={notes}
                />
            </div>

            <div className={styles.buttons}>
                <Button cssClass="primary">Add</Button>
                <BackButton steps={clickMapCount} />
            </div>
        </form>
    );
}

export default Form;
