import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContext";

function CountryList() {
    const { cities, isLoading } = useCities();
    if (isLoading) <Spinner />;

    if (!cities.length)
        return (
            <Message message="Add your first country by clicking a city from the map" />
        );

    const countries = cities.reduce((arr, city) => {
        if (arr.some((c) => c.country === city.country)) return arr;
        else
            return [
                ...arr,
                {
                    country: city.country,
                    emoji: city.emoji,
                },
            ];
    }, []);
    return (
        <ul className={styles.countryList}>
            {countries.map((country) => (
                <CountryItem key={country.country} country={country} />
            ))}
        </ul>
    );
}

export default CountryList;
