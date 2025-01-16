// import PropTypes from "prop-types";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

// CityList.propTypes = {
//     isLoading: PropTypes.bool,
//     cities: PropTypes.array,
// };

function CityList() {
    const { isLoading, cities } = useCities();

    if (isLoading) <Spinner />;
    if (!cities.length)
        return (
            <Message message="Add your first city by clicking a city from the map" />
        );
    return (
        <ul className={styles.cityList}>
            {cities.map((city) => (
                <CityItem key={city.id} city={city} />
            ))}
        </ul>
    );
}

export default CityList;
