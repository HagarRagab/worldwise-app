import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useCities } from "../contexts/CitiesContext";

function BackButton({ steps = 1 }) {
    const navigate = useNavigate();
    const { setClickMapCount } = useCities();

    return (
        <Button
            cssClass="back"
            onClick={(e) => {
                e.preventDefault();
                navigate(-steps);
                setClickMapCount(0);
            }}
        >
            <span>&larr;</span> Back
        </Button>
    );
}

export default BackButton;
