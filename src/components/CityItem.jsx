import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import PropType from "prop-types";
import { useCities } from "../contexts/CitiesContext";

CityItem.propTypes = {
    cityName: PropType.string,
    emoji: PropType.string,
    date: PropType.string,
};

function formattedDate(date) {
    return new Intl.DateTimeFormat(navigator.language, {
        month: "long",
        year: "numeric",
        day: "2-digit",
    }).format(new Date(date));
}

function CityItem({ city }) {
    const { currentCity, deleteCity } = useCities();
    const { cityName, emoji, date, id, position } = city;

    function handleDeleteCity(e) {
        e.preventDefault();
        deleteCity(id);
    }

    return (
        <li>
            <Link
                className={`${styles.cityItem} ${
                    currentCity.id === id ? styles["cityItem--active"] : ""
                }`}
                to={`${id}?lat=${position.lat}&lng=${position.lng}`}
            >
                <span className={styles.emoji}>{emoji}</span>
                <h3 className={styles.name}>{cityName}</h3>
                <time className={styles.date}>({formattedDate(date)})</time>
                <button className={styles.deleteBtn} onClick={handleDeleteCity}>
                    x
                </button>
            </Link>
        </li>
    );
}

export default CityItem;
