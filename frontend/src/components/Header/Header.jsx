import React, { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import ToggleButton from "../ToggleButton/ToggleButton";

export default function Header({
    searchKeyword,
    setSearchKeyword,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    authorityFilter,
    setAuthorityFilter,
    statusFilter,
    setStatusFilter
}) {

    const API_URL = "http://localhost:8080/api/auth";

    const navigate = useNavigate();
    const location = useLocation();

    const [, forceUpdate] = useState(0);

    const [showSort, setShowSort] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    // Custom dropdown states
    const [openSortDropdown, setOpenSortDropdown] = useState(null);
    const [openFilterDropdown, setOpenFilterDropdown] = useState(null);

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/homepage");
        }
    };

    const handleHome = () => {
        navigate("/admin");
    };

    useEffect(() => {
        const refresh = () => forceUpdate(prev => prev + 1);

        window.addEventListener("login", refresh);

        return () => {
            window.removeEventListener("login", refresh);
        };
    }, []);

    const logButtonEvent = ({
        buttonNo,
        buttonName,
        request,
        response,
        status
    }) => {
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

    const sortByOptions = [
        {
            value: "userId",
            label: "User ID"
        },
        {
            value: "userName",
            label: "User Name"
        },
        {
            value: "email",
            label: "Email"
        },
        {
            value: "authorityProfiles.authorityName",
            label: "Authority"
        },
        {
            value: "status.description",
            label: "Status"
        },
        {
            value: "createdAt",
            label: "Created Date"
        }
    ];

    const sortOrderOptions = [
        {
            value: "asc",
            label: "A → Z"
        },
        {
            value: "desc",
            label: "Z → A"
        }
    ];

    const getSortByLabel = () => {
        const selected = sortByOptions.find(
            option => option.value === sortBy
        );

        return selected ? selected.label : "User ID";
    };

    const getSortOrderLabel = () => {
        const selected = sortOrderOptions.find(
            option => option.value === sortDir
        );

        return selected ? selected.label : "A → Z";
    };

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

        setOpenSortDropdown(null);
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

        setOpenFilterDropdown(null);
        setShowFilter(false);
    };

    const resetFilter = () => {
        setAuthorityFilter([]);
        setStatusFilter([]);
        setOpenFilterDropdown(null);
    };

    const handleSortButton = () => {
        setShowSort(prev => !prev);
        setShowFilter(false);

        setOpenSortDropdown(null);
        setOpenFilterDropdown(null);
    };

    const handleFilterButton = () => {
        setShowFilter(prev => !prev);
        setShowSort(false);

        setOpenSortDropdown(null);
        setOpenFilterDropdown(null);
    };

    const handleSortDropdown = (dropdownName) => {

        setOpenSortDropdown(prev =>
            prev === dropdownName
                ? null
                : dropdownName
        );
    };

    const handleFilterDropdown = (dropdownName) => {

        setOpenFilterDropdown(prev =>
            prev === dropdownName
                ? null
                : dropdownName
        );
    };

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("userName");

    const authorityString =
        localStorage.getItem("authority") || "";

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

            toast.success(
                "Logged out successfully."
            );

        } catch {

            toast.error(
                "Logout failed."
            );

        } finally {

            localStorage.clear();

            window.dispatchEvent(
                new Event("login")
            );

            navigate("/");
        }
    };

    return (

        <header className="header">

            {/* =========================
                LEFT
            ========================= */}

            <div className="header-left">

                <button
                    className="header-btn home-btn"
                    onClick={handleHome}
                >
                    🏠 Home
                </button>

                <button
                    className="header-btn back-btn"
                    onClick={handleBack}
                >
                    ← Back
                </button>

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
                                    message:
                                        "Navigating to Create User Component"
                                },
                                status: 200
                            });

                            navigate(
                                "/admin/create-user"
                            );
                        }}
                    >
                        Create User
                    </button>

                )}

                {permissions.canCreateNotebook && (

                    <button
                        className="header-btn green"
                        onClick={() => {

                            logButtonEvent({
                                buttonNo: "HB21",
                                buttonName: "Create Notebook Button",
                                request: {
                                    action: "Navigate",
                                    from: location.pathname,
                                    to: "/user-homepage/create-notebook"
                                },
                                response: {
                                    message:
                                        "Navigating to Create Notebook Component"
                                },
                                status: 200
                            });

                            navigate(
                                "/user-homepage/create-notebook"
                            );
                        }}
                    >
                        New Notebook
                    </button>

                )}

                {permissions.canCreateNotebook && (

                    <button
                        className="header-btn green"
                        onClick={() => {

                            logButtonEvent({
                                buttonNo: "HB22",
                                buttonName: "Create Page Button",
                                request: {
                                    action: "Navigate",
                                    from: location.pathname,
                                    to: "/user-homepage/create-page"
                                },
                                response: {
                                    message:
                                        "Navigating to Create Page Component"
                                },
                                status: 200
                            });

                            navigate(
                                "/user-homepage/create-page"
                            );
                        }}
                    >
                        New Page
                    </button>

                )}

                {permissions.canViewPages && (

                    <button
                        className="header-btn orange"
                    >
                        View Pages
                    </button>

                )}

            </div>


            {/* =========================
                CENTER
            ========================= */}

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
                        onChange={(e) =>
                            setSearchKeyword(
                                e.target.value
                            )
                        }
                    />

                    <FaSearch
                        className="search-icon"
                    />

                </div>

            </div>


            {/* =========================
                RIGHT
            ========================= */}

            <div className="header-right">

                {/* =========================
                    SORT
                ========================= */}

                {permissions.canSort && (

                    <div className="header-popup-container">

                        <button
                            className="header-btn gray"
                            onClick={handleSortButton}
                        >
                            ⬍ Sort
                        </button>


                        {showSort && (

                            <div className="header-popup">

                                <div className="popup-title">
                                    <span>
                                        Sort Users
                                    </span>
                                </div>


                                <div className="popup-body">

                                    {/* SORT BY */}

                                    <div className="popup-section">

                                        <label>
                                            Sort By
                                        </label>

                                        <div className="custom-dropdown">

                                            <button
                                                type="button"
                                                className={`custom-dropdown-button ${
                                                    openSortDropdown === "sortBy"
                                                        ? "dropdown-open"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleSortDropdown(
                                                        "sortBy"
                                                    )
                                                }
                                            >

                                                <span>
                                                    {getSortByLabel()}
                                                </span>

                                                <span
                                                    className={`dropdown-arrow ${
                                                        openSortDropdown === "sortBy"
                                                            ? "arrow-up"
                                                            : ""
                                                    }`}
                                                >
                                                    ▼
                                                </span>

                                            </button>


                                            <div
                                                className={`custom-dropdown-options ${
                                                    openSortDropdown === "sortBy"
                                                        ? "options-open"
                                                        : ""
                                                }`}
                                            >

                                                {sortByOptions.map(
                                                    option => (

                                                        <button
                                                            type="button"
                                                            key={
                                                                option.value
                                                            }
                                                            className={`custom-dropdown-option ${
                                                                sortBy ===
                                                                option.value
                                                                    ? "selected-option"
                                                                    : ""
                                                            }`}
                                                            onClick={() => {

                                                                setSortBy(
                                                                    option.value
                                                                );

                                                                setOpenSortDropdown(
                                                                    null
                                                                );
                                                            }}
                                                        >
                                                            {
                                                                option.label
                                                            }
                                                        </button>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    </div>


                                    {/* ORDER */}

                                    <div className="popup-section">

                                        <label>
                                            Order
                                        </label>

                                        <div className="custom-dropdown">

                                            <button
                                                type="button"
                                                className={`custom-dropdown-button ${
                                                    openSortDropdown === "order"
                                                        ? "dropdown-open"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleSortDropdown(
                                                        "order"
                                                    )
                                                }
                                            >

                                                <span>
                                                    {
                                                        getSortOrderLabel()
                                                    }
                                                </span>

                                                <span
                                                    className={`dropdown-arrow ${
                                                        openSortDropdown === "order"
                                                            ? "arrow-up"
                                                            : ""
                                                    }`}
                                                >
                                                    ▼
                                                </span>

                                            </button>


                                            <div
                                                className={`custom-dropdown-options ${
                                                    openSortDropdown === "order"
                                                        ? "options-open"
                                                        : ""
                                                }`}
                                            >

                                                {sortOrderOptions.map(
                                                    option => (

                                                        <button
                                                            type="button"
                                                            key={
                                                                option.value
                                                            }
                                                            className={`custom-dropdown-option ${
                                                                sortDir ===
                                                                option.value
                                                                    ? "selected-option"
                                                                    : ""
                                                            }`}
                                                            onClick={() => {

                                                                setSortDir(
                                                                    option.value
                                                                );

                                                                setOpenSortDropdown(
                                                                    null
                                                                );
                                                            }}
                                                        >
                                                            {
                                                                option.label
                                                            }
                                                        </button>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* BUTTONS */}

                                <div className="popup-buttons">

                                    <button
                                        className="apply-btn"
                                        onClick={applySort}
                                    >
                                        Apply
                                    </button>

                                    <button
                                        className="cancel-btn"
                                        onClick={() => {

                                            setOpenSortDropdown(
                                                null
                                            );

                                            setShowSort(
                                                false
                                            );
                                        }}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </div>

                        )}

                    </div>

                )}
                {permissions.canFilter && (
                    <div className="header-popup-container">
                        <button
                            className="header-btn gray"
                            onClick={handleFilterButton}
                        >
                            ⛃ Filter
                        </button>
                        {showFilter && (
                            <div className="header-popup filter-popup">
                                <div className="popup-title">
                                    <span>
                                        Filter Users
                                    </span>

                                </div>
                                <div className="popup-body">
                                    <div className="popup-section">
                                        <label>
                                            Authorities
                                        </label>
                                        {authorityOptions.map(
                                            authority => (
                                                <label
                                                    key={
                                                        authority
                                                    }
                                                    className="checkbox-item"
                                                >

                                                    <input
                                                        type="checkbox"
                                                        checked={authorityFilter.includes(
                                                            authority
                                                        )}
                                                        onChange={() =>
                                                            toggleAuthority(
                                                                authority
                                                            )
                                                        }
                                                    />

                                                    <span>
                                                        {
                                                            authority
                                                        }
                                                    </span>

                                                </label>

                                            )
                                        )}

                                    </div>


                                    {/* STATUS */}

                                    <div className="popup-section">

                                        <label>
                                            Status
                                        </label>

                                        {statusOptions.map(
                                            status => (

                                                <label
                                                    key={status}
                                                    className="checkbox-item"
                                                >

                                                    <input
                                                        type="checkbox"
                                                        checked={statusFilter.includes(
                                                            status
                                                        )}
                                                        onChange={() =>
                                                            toggleStatus(
                                                                status
                                                            )
                                                        }
                                                    />

                                                    <span>
                                                        {
                                                            status ===
                                                            "UAC"
                                                                ? "Active"
                                                                : "Inactive"
                                                        }
                                                    </span>
                                                </label>
                                            )
                                        )}
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
                                        onClick={() => {
                                            setOpenFilterDropdown(
                                                null
                                            );
                                            setShowFilter(
                                                false
                                            );
                                        }}
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
                    Welcome,&nbsp;
                    <b>
                        {username}
                    </b>
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