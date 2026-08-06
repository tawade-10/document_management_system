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

    const [sortBy, setSortBy] = useState("createdAt");
    const [sortDir, setSortDir] = useState("desc");

    const [authorityFilter, setAuthorityFilter] = useState([]);

    const [statusFilter, setStatusFilter] = useState([]);

    const [showSort, setShowSort] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        const refresh = () => forceUpdate(prev => prev + 1);
        window.addEventListener("login", refresh);
        return () => window.removeEventListener("login", refresh);
    }, []);

    const logButtonEvent = ({ buttonNo, buttonName, request, response, status }) => {
        console.group(`${buttonNo} - ${buttonName}`);
        console.log("Request");
        console.log(request);
        console.log("Response");
        console.log(response);
        console.log("Status Code");
        console.log(status);
        console.groupEnd();
    };

    const authorityOptions = [
        "ADMIN",
        "SUPER_USER",
        "USER"
    ];

    const statusOptions = [
        "UAC",
        "UIA"
    ];

    const toggleAuthority = (value) => {
        if (authorityFilter.includes(value)) {
            setAuthorityFilter(
                authorityFilter.filter(
                    item => item !== value
                )
            );
        } else {
            setAuthorityFilter([
                ...authorityFilter,
                value
            ]);
        }
    };

    const toggleStatus = (value) => {
        if (statusFilter.includes(value)) {
            setStatusFilter(
                statusFilter.filter(
                    item => item !== value
                )
            );
        } else {
            setStatusFilter([
                ...statusFilter,
                value
            ]);
        }
    };

    const applySort = () => {
        logButtonEvent({
            buttonNo: "HB11",
            buttonName: "Sort Button",
            request: {
                sortBy,
                sortDir
            },
            response: {
                message: "Sorting Applied"
            },
            status: 200
        });
        setShowSort(false);
    };

    const applyFilter = () => {
        logButtonEvent({
            buttonNo: "HB12",
            buttonName: "Filter Button",
            request: {
                authorityFilter,
                statusFilter
            },
            response: {
                message: "Filter Applied"
            },
            status: 200
        });
        setShowFilter(false);
    };

    const resetFilter = () => {
        setAuthorityFilter([]);
        setStatusFilter([]);
    };

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("userName");

   const authorityString = localStorage.getItem("authority") || "";

   const authorities = authorityString
       .split(",")
       .map(role => role.trim().toUpperCase());

   const currentRole = localStorage.getItem("currentRole") || "USER";

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
            isUser || isSuperUser || isAdmin,
        canFilter:
            isUser || isSuperUser || isAdmin,
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
                    onClick={() => {
                        logButtonEvent({
                            buttonNo: "HB14",
                            buttonName: "Create User Button",
                            request: {
                                action: "Navigate",
                                from: location.pathname,
                                to: "/admin/add-user"
                            },
                            response: {
                                message: "Navigating to Create User Component"
                            },
                            status: 200
                        });
                        navigate("/admin/create-user");
                    }}
                >
                    Create User
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
        <div className="header-popup-container">

            <button
                className="header-btn gray"
                onClick={() => {
                    setShowSort(!showSort);
                    setShowFilter(false);
                }}
            >
                ⬍ Sort
            </button>

            {showSort && (
                <div className="header-popup">

                    <div className="popup-title">
                        <span>Sort Users</span>
                    </div>

                    <div className="popup-body">

                        <div className="popup-section">

                            <label>Sort By</label>

                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(e.target.value)
                                }
                            >
                                <option value="userId">User ID</option>
                                <option value="userName">User Name</option>
                                <option value="email">Email</option>
                                <option value="authorityProfiles.authorityName">
                                    Authority
                                </option>
                                <option value="status.description">
                                    Status
                                </option>
                                <option value="createdAt">
                                    Created Date
                                </option>
                            </select>

                        </div>

                        <div className="popup-section">

                            <label>Order</label>

                            <select
                                value={sortDir}
                                onChange={(e) =>
                                    setSortDir(e.target.value)
                                }
                            >
                                <option value="asc">
                                    A → Z
                                </option>

                                <option value="desc">
                                    Z → A
                                </option>

                            </select>

                        </div>

                    </div>

                    <div className="popup-buttons">

                        <button
                            className="apply-btn"
                            onClick={applySort}
                        >
                            Apply
                        </button>

                        <button
                            className="cancel-btn"
                            onClick={() => setShowSort(false)}
                        >
                            Cancel
                        </button>

                    </div>

                </div>
            )}

        </div>
    )}

    {/* FILTER */}
    {permissions.canFilter && (
        <div className="header-popup-container">

            <button
                className="header-btn gray"
                onClick={() => {
                    setShowFilter(!showFilter);
                    setShowSort(false);
                }}
            >
                ⛃ Filter
            </button>

            {showFilter && (

                <div className="header-popup">

                    <div className="popup-title">
                        <span>Filter Users</span>
                    </div>

                    <div className="popup-body">

                        <div className="popup-section">

                            <label>Authorities</label>

                            {authorityOptions.map(authority => (

                                <label
                                    key={authority}
                                    className="checkbox-item"
                                >

                                    <input
                                        type="checkbox"
                                        checked={authorityFilter.includes(authority)}
                                        onChange={() => toggleAuthority(authority)}
                                    />

                                    <span>{authority}</span>

                                </label>

                            ))}

                        </div>

                        <div className="popup-section">

                            <label>Status</label>

                            {statusOptions.map(status => (

                                <label
                                    key={status}
                                    className="checkbox-item"
                                >

                                    <input
                                        type="checkbox"
                                        checked={statusFilter.includes(status)}
                                        onChange={() => toggleStatus(status)}
                                    />

                                    <span>

                                        {status === "UAC"
                                            ? "Active"
                                            : "Inactive"}

                                    </span>

                                </label>

                            ))}

                        </div>

                    </div>

                    <div className="popup-buttons">

                        <button
                            className="apply-btn"
                            onClick={applyFilter}
                        >
                            Apply
                        </button>

                        <button
                            className="reset-btn"
                            onClick={resetFilter}
                        >
                            Reset
                        </button>

                        <button
                            className="cancel-btn"
                            onClick={() => setShowFilter(false)}
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            )}

        </div>
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

