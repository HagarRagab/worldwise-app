import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useReducer,
} from "react";

const BASE_URL = "https://dull-sour-preface.glitch.me";

const initialState = {
    cities: [],
    currentCity: {},
    // loading, error, done
    status: null,
    error: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "loading":
            return { ...state, status: "loading" };
        case "cities/loaded":
            return { ...state, cities: action.payload, status: "done" };
        case "city/loaded":
            return { ...state, currentCity: action.payload, status: "done" };
        case "city/created":
            return {
                ...state,
                cities: [...state.cities, action.payload],
                currentCity: action.payload,
                status: "done",
            };
        case "city/deleted":
            return {
                ...state,
                cities: state.cities.filter(
                    (city) => city.id !== action.payload
                ),
                status: "done",
            };
        case "rejected":
            return { ...state, status: "error", error: action.payload };
        default:
            throw new Error("Unknown action");
    }
}

const CitiesContext = createContext();

function CitiesProvider({ children }) {
    const [{ cities, currentCity, status, error }, dispatch] = useReducer(
        reducer,
        initialState
    );
    const [clickMapCount, setClickMapCount] = useState(0);

    useEffect(function () {
        async function fetchCities() {
            dispatch({ type: "loading" });
            try {
                const res = await fetch(`${BASE_URL}/cities`);
                if (!res.ok)
                    throw new Error(
                        "Something went wrong. Cannot fetch cities. Please try again later"
                    );
                const data = await res.json();
                dispatch({
                    type: "cities/loaded",
                    payload: data,
                });
            } catch (error) {
                dispatch({ type: "rejected", payload: error.message });
            }
        }
        fetchCities();
    }, []);

    const getCity = useCallback(
        async function (id) {
            if (id === currentCity.id) return;
            dispatch({ type: "loading" });
            try {
                const res = await fetch(`${BASE_URL}/cities/${id}`);
                if (!res.ok)
                    throw new Error(
                        "Something went wrong. Cannot get city. Please try again later."
                    );
                const data = await res.json();
                dispatch({ type: "city/loaded", payload: data });
            } catch (error) {
                dispatch({ type: "rejected", payload: error.message });
            }
        },
        [currentCity.id]
    );

    async function addNewCity(newCity) {
        dispatch({ type: "loading" });
        try {
            const res = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok)
                throw new Error(
                    "Something went wrong. Cannot add city. Please try again later."
                );
            dispatch({
                type: "city/created",
                payload: newCity,
            });
        } catch (error) {
            dispatch({ type: "rejected", payload: error.message });
        }
    }

    async function deleteCity(id) {
        dispatch({ type: "loading" });
        try {
            const res = await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok)
                throw new Error(
                    "Something went wrong. Cannot delete city. Please try again later."
                );
            dispatch({
                type: "city/deleted",
                payload: id,
            });
        } catch (error) {
            dispatch({ type: "rejected", payload: error.message });
        }
    }

    return (
        <CitiesContext.Provider
            value={{
                isLoading: status === "loading",
                cities,
                getCity,
                currentCity,
                addNewCity,
                deleteCity,
                clickMapCount,
                setClickMapCount,
                error,
            }}
        >
            {children}
        </CitiesContext.Provider>
    );
}

function useCities() {
    const context = useContext(CitiesContext);
    if (context === undefined)
        throw new Error("CitiesContext is used outside of the CitiesProvider");
    return context;
}

export { CitiesProvider, useCities };
