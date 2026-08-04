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

   const authorityString = localStorage.getItem("authority") || "";

   const authorities = authorityString
       .split(",")
       .map(role => role.trim().toUpperCase());

   const currentRole =
       localStorage.getItem("currentRole") || "USER";

   const isAdmin = currentRole === "ADMIN";
   const isSuperUser = currentRole === "SUPER_USER";
   const isUser = currentRole === "USER";

    const permissions = {

        canManageUsers:
            isAdmin,

        canCreateNotebook:
            isUser || isSuperUser,

        canCreatePage:
            isUser || isSuperUser,

        canViewPages:
            isUser || isSuperUser,

        canSort:
            isUser || isSuperUser,

        canFilter:
            isUser || isSuperUser,

        canToggleRole:
            !isAdmin &&
            authorities.includes("USER")

    };

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

        {/* LEFT */}
        <div className="header-left">

            <div
                className="logo"
                onClick={() => navigate("/homepage")}
            >
                MOM Portal
            </div>

            {permissions.canManageUsers && (
                <button
                    className="header-btn blue"
                    onClick={() => navigate("/admin/add-user")}
                >
                    Add User
                </button>
            )}

            {permissions.canCreateNotebook && (
                <button className="header-btn green">
                    New Notebook
                </button>
            )}

            {permissions.canCreatePage && (
                <button className="header-btn green">
                    New Page
                </button>
            )}

            {permissions.canViewPages && (
                <button className="header-btn orange">
                    View Pages
                </button>
            )}

        </div>

        <div className="header-center">

            <div className="search-container">

                <input
                    className="search-input"
                    type="text"
                    placeholder={
                        permissions.canManageUsers
                            ? "Search Users..."
                            : "Search Notebooks / Pages..."
                    }
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />

                <FaSearch className="search-icon" />

            </div>

        </div>

        <div className="header-right">

            {permissions.canSort && (
                <button className="header-btn gray">
                    Sort
                </button>
            )}

            {permissions.canFilter && (
                <button className="header-btn gray">
                    Filter
                </button>
            )}

            {permissions.canToggleRole && (
                <ToggleButton />
            )}

            <span className="welcome-user">
                Welcome,&nbsp;<b>{username}</b>
            </span>

            <CgProfile
                size={24}
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