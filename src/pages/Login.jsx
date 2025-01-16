import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import Spinner from "../components/Spinner";

export default function Login() {
    const [email, setEmail] = useState("jack@example.com");
    const [password, setPassword] = useState("qwerty");
    const navigate = useNavigate();
    const { isAuthinticated, login, error } = useAuth();

    useEffect(
        function () {
            if (isAuthinticated) navigate("/app", { replace: true });
        },
        [isAuthinticated, navigate]
    );

    function handleLogin(e) {
        e.preventDefault();
        if (email && password) login(email, password);
    }

    if (isAuthinticated) return <Spinner />;

    return (
        <main className={styles.login}>
            <PageNav />
            <p className={styles.fail}>{error}</p>
            <form className={styles.form} onSubmit={handleLogin}>
                <div className={styles.row}>
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>

                <div className={styles.row}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>

                <div>
                    <Button cssClass="primary">Login</Button>
                </div>
            </form>
        </main>
    );
}
