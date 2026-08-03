import React, { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import ToggleButton from "../ToggleButton/ToggleButton";

export default function Header({
    searchKeyword = "",
    setSearchKeyword = () => {}
}) {

    const API_URL = "http://localhost:8080/api/auth";

    const navigate = useNavigate();
    const location = useLocation();

    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const refresh = () => forceUpdate(prev => prev + 1);
        window.addEventListener("login", refresh);
        return () => window.removeEventListener("login", refresh);
    }, []);

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("userName");

    const hideHeaderRoutes = [
        "/",
        "/forgot-password",
        "/reset-password"
    ];

    if (hideHeaderRoutes.includes(location.pathname)) {
        return null;
    }

    const handleLogout = async () => {
        try {
            await axios.post(
                `${API_URL}/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Logged out successfully.");

        } catch {

            toast.error("Logout failed.");

        } finally {

            localStorage.clear();
            window.dispatchEvent(new Event("login"));
            navigate("/");

        }
    };

    return (

        <header className="header">

            <div className="header-left">

                <div
                    className="logo"
                    onClick={() => navigate("/homepage")}
                >
                    MOM Portal
                </div>

                <div className="search-container">

                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search Users..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />

                    <FaSearch className="search-icon" />

                </div>

            </div>

<div className="header-right">

    <button className="header-btn success">
        📒 New Notebook
    </button>

    <button className="header-btn success">
        📄 New Page
    </button>

    <button className="header-btn warning">
        📑 View Pages
    </button>

    <ToggleButton />

    <span className="welcome-user">
        Welcome,&nbsp;<b>{username}</b>
    </span>

    <CgProfile
        size={30}
        className="profile-icon"
    />

    <button
        className="logout-btn"
        onClick={handleLogout}
    >
        Logout
    </button>

</div>
        </header>
    );
}