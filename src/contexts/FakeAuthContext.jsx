import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
};

const initialState = {
    user: null,
    isAuthinticated: false,
    error: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "login":
            return { ...state, user: action.payload, isAuthinticated: true };
        case "login/failed":
            return {
                ...state,
                user: null,
                isAuthinticated: false,
                error: action.payload,
            };
        case "logout":
            return { ...state, user: null, isAuthinticated: false };
        default:
            throw new Error("unkown action");
    }
}

function AuthProvider({ children }) {
    const [{ user, isAuthinticated, error }, dispatch] = useReducer(
        reducer,
        initialState
    );

    function login(email, password) {
        if (FAKE_USER.email === email && FAKE_USER.password === password)
            dispatch({ type: "login", payload: FAKE_USER });
        else
            dispatch({
                type: "login/failed",
                payload: "Please check your email or password again.",
            });
    }

    function logout() {
        dispatch({ type: "logout" });
    }

    return (
        <AuthContext.Provider
            value={{ user, isAuthinticated, login, logout, error }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const value = useContext(AuthContext);
    if (value === undefined)
        throw new Error("AuthContext was used outside AuthProvider");
    return value;
}

export { useAuth, AuthProvider };
