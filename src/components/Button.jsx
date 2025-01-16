import styles from "./Button.module.css";

function Button({ children, cssClass, onClick }) {
    return (
        <button
            className={`${styles.btn} ${styles[cssClass]}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;
