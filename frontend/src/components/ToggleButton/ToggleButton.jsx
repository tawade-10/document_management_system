import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ToggleButton.css";

export default function ToggleButton() {

    const navigate = useNavigate();

    const [isSuperUser, setIsSuperUser] = useState(false);

    const handleToggle = () => {

        const next = !isSuperUser;

        setIsSuperUser(next);

        if (next) {
            navigate("/superuser-homepage");
        } else {
            navigate("/user-homepage");
        }
    };

    return (

        <div className="toggle-container">
            <span
                className={`toggle-label ${!isSuperUser ? "active" : ""}`}
            >
            </span>
            <label className="switch">

                <input
                    type="checkbox"
                    checked={isSuperUser}
                    onChange={handleToggle}
                />
                <span className="slider"></span>
            </label>
            <span
                className={`toggle-label ${isSuperUser ? "active" : ""}`}
            >

            </span>
        </div>
    );
}