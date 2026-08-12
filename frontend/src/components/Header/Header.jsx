import React, { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import ToggleButton from "../ToggleButton/ToggleButton";

import CreateNotebookPopup from "../CreateNotebookPopup/CreateNotebookPopup";
// import CreatePagePopup from "../HeaderPopups/CreatePagePopup";


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

    /* =========================
       POPUP STATES
    ========================= */

    const [showSort, setShowSort] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    const [showCreateNotebook, setShowCreateNotebook] =
        useState(false);

    const [showCreatePage, setShowCreatePage] =
        useState(false);

    const [openSortDropdown, setOpenSortDropdown] =
        useState(null);

    const [openFilterDropdown, setOpenFilterDropdown] =
        useState(null);


    /* =========================
       LOCAL STORAGE
    ========================= */

    const token =
        localStorage.getItem("token");

    const username =
        localStorage.getItem("userName");

    const authorityString =
        localStorage.getItem("authority") || "";


    const authorities =
        authorityString
            .split(",")
            .map(role =>
                role.trim().toUpperCase()
            )
            .filter(Boolean);


    const currentRole =
        localStorage.getItem("currentRole") ||
        "USER";


    /* =========================
       ROLE
    ========================= */

    const isAdmin =
        currentRole === "ADMIN";

    const isSuperUser =
        currentRole === "SUPER_USER";

    const isUser =
        currentRole === "USER";


    /* =========================
       PERMISSIONS
    ========================= */

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
            isAdmin ||
            isSuperUser ||
            isUser,

        canFilter:
            isAdmin ||
            isSuperUser ||
            isUser,

        canToggleRole:
            !isAdmin &&
            authorities.includes("USER")
    };


    /* =========================
       PAGE TYPES
    ========================= */

    const isUserPage =
        currentRole === "USER";

    const isSuperUserPage =
        currentRole === "SUPER_USER";

    const isAdminPage =
        currentRole === "ADMIN";


    const isNotebookPage =
        isSuperUserPage ||
        location.pathname ===
            "/user-homepage/view-all-notebooks-pages";


    /* =========================
       SEARCH PLACEHOLDER
    ========================= */

    const getSearchPlaceholder = () => {

        if (isAdminPage) {
            return "Search Users...";
        }

        if (isNotebookPage) {
            return "Search Notebooks...";
        }

        if (isUserPage) {
            return "Search Notebooks / Pages...";
        }

        return "Search...";
    };


    /* =========================
       SORT OPTIONS
    ========================= */

    const userSortByOptions = [

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
            value:
                "authorityProfiles.authorityName",
            label: "Authority"
        },

        {
            value:
                "status.description",
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


    /* =========================
       FILTER OPTIONS
    ========================= */

    const authorityOptions = [
        "ADMIN",
        "SUPER_USER",
        "USER"
    ];


    const statusOptions = [
        "UAC",
        "UIA"
    ];


    /* =========================
       SORT LABELS
    ========================= */

    const getSortByLabel = () => {

        const selected =
            userSortByOptions.find(
                option =>
                    option.value === sortBy
            );

        return selected
            ? selected.label
            : "User ID";
    };


    const getSortOrderLabel = () => {

        const selected =
            sortOrderOptions.find(
                option =>
                    option.value === sortDir
            );

        return selected
            ? selected.label
            : "A → Z";
    };


    /* =========================
       BUTTON EVENT LOGGER
    ========================= */

    const logButtonEvent = ({
        buttonNo,
        buttonName,
        request,
        response,
        status
    }) => {

        console.group(
            `${buttonNo} - ${buttonName}`
        );

        console.log("Request");
        console.log(request);

        console.log("Response");
        console.log(response);

        console.log("Status Code");
        console.log(status);

        console.groupEnd();
    };


    /* =========================
       LOGIN / ROLE CHANGE
    ========================= */

    useEffect(() => {

        const refresh = () => {

            forceUpdate(
                prev => prev + 1
            );
        };


        window.addEventListener(
            "login",
            refresh
        );

        window.addEventListener(
            "roleChanged",
            refresh
        );


        return () => {

            window.removeEventListener(
                "login",
                refresh
            );

            window.removeEventListener(
                "roleChanged",
                refresh
            );
        };

    }, []);


    /* =========================
       CLOSE POPUPS ON ROUTE/ROLE
    ========================= */

    useEffect(() => {

        setShowSort(false);
        setShowFilter(false);

        setShowCreateNotebook(false);
        setShowCreatePage(false);

        setOpenSortDropdown(null);
        setOpenFilterDropdown(null);

    }, [
        location.pathname,
        currentRole
    ]);


    /* =========================
       HOME
    ========================= */

    const handleHome = () => {

        const role =
            localStorage.getItem(
                "currentRole"
            ) || "USER";


        if (role === "ADMIN") {

            navigate("/admin");

        } else if (
            role === "SUPER_USER"
        ) {

            navigate(
                "/superuser-homepage"
            );

        } else if (
            role === "USER"
        ) {

            navigate(
                "/user-homepage"
            );

        } else {

            navigate("/");
        }
    };


    /* =========================
       BACK
    ========================= */

    const handleBack = () => {

        if (window.history.length > 1) {

            navigate(-1);

        } else {

            navigate(
                "/user-homepage"
            );
        }
    };


    /* =========================
       NEW NOTEBOOK BUTTON
    ========================= */

    const handleCreateNotebookButton = () => {

        const nextState =
            !showCreateNotebook;


        setShowCreateNotebook(
            nextState
        );

        setShowCreatePage(false);
        setShowSort(false);
        setShowFilter(false);

        setOpenSortDropdown(null);
        setOpenFilterDropdown(null);


        logButtonEvent({

            buttonNo: "HB21",

            buttonName:
                "Create Notebook Button",

            request: {

                action:
                    nextState
                        ? "Open Popup"
                        : "Close Popup",

                from:
                    location.pathname,

                currentRole
            },

            response: {

                message:
                    nextState
                        ? "Create Notebook popup opened"
                        : "Create Notebook popup closed"
            },

            status: 200
        });
    };


    /* =========================
       NEW PAGE BUTTON
    ========================= */

    const handleCreatePageButton = () => {

        const nextState =
            !showCreatePage;


        setShowCreatePage(
            nextState
        );

        setShowCreateNotebook(false);
        setShowSort(false);
        setShowFilter(false);

        setOpenSortDropdown(null);
        setOpenFilterDropdown(null);


        logButtonEvent({

            buttonNo: "HB22",

            buttonName:
                "Create Page Button",

            request: {

                action:
                    nextState
                        ? "Open Popup"
                        : "Close Popup",

                from:
                    location.pathname,

                currentRole
            },

            response: {

                message:
                    nextState
                        ? "Create Page popup opened"
                        : "Create Page popup closed"
            },

            status: 200
        });
    };


    /* =========================
       SORT
    ========================= */

    const handleSortButton = () => {

        setShowSort(
            prev => !prev
        );

        setShowFilter(false);
        setShowCreateNotebook(false);
        setShowCreatePage(false);

        setOpenSortDropdown(null);
        setOpenFilterDropdown(null);
    };


    /* =========================
       FILTER
    ========================= */

    const handleFilterButton = () => {

        setShowFilter(
            prev => !prev
        );

        setShowSort(false);
        setShowCreateNotebook(false);
        setShowCreatePage(false);

        setOpenSortDropdown(null);
        setOpenFilterDropdown(null);
    };


    /* =========================
       AUTHORITY FILTER
    ========================= */

    const toggleAuthority = value => {

        if (
            authorityFilter.includes(value)
        ) {

            setAuthorityFilter(
                authorityFilter.filter(
                    item =>
                        item !== value
                )
            );

        } else {

            setAuthorityFilter([
                ...authorityFilter,
                value
            ]);
        }
    };


    /* =========================
       STATUS FILTER
    ========================= */

    const toggleStatus = value => {

        if (
            statusFilter.includes(value)
        ) {

            setStatusFilter(
                statusFilter.filter(
                    item =>
                        item !== value
                )
            );

        } else {

            setStatusFilter([
                ...statusFilter,
                value
            ]);
        }
    };


    /* =========================
       SORT DROPDOWN
    ========================= */

    const handleSortDropdown = dropdownName => {

        setOpenSortDropdown(
            prev =>
                prev === dropdownName
                    ? null
                    : dropdownName
        );
    };


    /* =========================
       FILTER DROPDOWN
    ========================= */

    const handleFilterDropdown = dropdownName => {

        setOpenFilterDropdown(
            prev =>
                prev === dropdownName
                    ? null
                    : dropdownName
        );
    };


    /* =========================
       APPLY SORT
    ========================= */

    const applySort = () => {

        logButtonEvent({

            buttonNo: "HB11",

            buttonName:
                "Sort Button",

            request: {

                currentRole,
                sortBy,
                sortDir
            },

            response: {

                message:
                    isSuperUserPage
                        ? "Notebook sorting applied"
                        : "Sorting Applied"
            },

            status: 200
        });


        setOpenSortDropdown(null);
        setShowSort(false);
    };


    /* =========================
       APPLY FILTER
    ========================= */

    const applyFilter = () => {

        logButtonEvent({

            buttonNo: "HB12",

            buttonName:
                "Filter Button",

            request: {

                currentRole,

                authorityFilter,

                statusFilter
            },

            response: {

                message:
                    isSuperUserPage
                        ? "Notebook filtering applied"
                        : "Filter Applied"
            },

            status: 200
        });


        setOpenFilterDropdown(null);
        setShowFilter(false);
    };


    /* =========================
       RESET FILTER
    ========================= */

    const resetFilter = () => {

        setAuthorityFilter([]);
        setStatusFilter([]);

        setOpenFilterDropdown(null);
    };


    /* =========================
       LOGOUT
    ========================= */

    const handleLogout = async () => {

        try {

            await axios.post(
                `${API_URL}/logout`,
                {},
                {
                    headers: {

                        Authorization:
                            `Bearer ${token}`
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


    /* =========================
       HIDDEN ROUTES
    ========================= */

    const hideHeaderRoutes = [

        "/",

        "/forgot-password",

        "/reset-password"
    ];


    if (
        hideHeaderRoutes.includes(
            location.pathname
        )
    ) {

        return null;
    }


    /* =========================
       JSX
    ========================= */

    return (

        <header className="header">

            {/* =================================
                LEFT SIDE
            ================================= */}

            <div className="header-left">

                {/* HOME */}

                <button
                    className="header-btn home-btn"
                    onClick={handleHome}
                >
                    🏠 Home
                </button>


                {/* BACK */}

                <button
                    className="header-btn back-btn"
                    onClick={handleBack}
                >
                    ← Back
                </button>


                {/* CREATE USER */}

                {permissions.canManageUsers && (

                    <button
                        className="header-btn blue"
                        onClick={() => {

                            logButtonEvent({

                                buttonNo: "HB14",

                                buttonName:
                                    "Create User Button",

                                request: {

                                    action:
                                        "Navigate",

                                    from:
                                        location.pathname,

                                    to:
                                        "/admin/create-user"
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


                {/* =================================
                    NEW NOTEBOOK
                ================================= */}

                {permissions.canCreateNotebook && (

                    <div className="header-popup-container">

                        <button
                            className="header-btn green"
                            onClick={
                                handleCreateNotebookButton
                            }
                        >
                            New Notebook
                        </button>


                        {showCreateNotebook && (

                            <CreateNotebookPopup
                                onClose={() =>
                                    setShowCreateNotebook(
                                        false
                                    )
                                }

                                currentRole={
                                    currentRole
                                }

                                location={
                                    location
                                }

                                logButtonEvent={
                                    logButtonEvent
                                }
                            />
                        )}

                    </div>
                )}


                {/* =================================
                    NEW PAGE
                ================================= */}

                {permissions.canCreatePage && (

                    <div className="header-popup-container">

                        <button
                            className="header-btn green"
                            onClick={
                                handleCreatePageButton
                            }
                        >
                            New Page
                        </button>


                        {showCreatePage && (

                            <CreatePagePopup
                                onClose={() =>
                                    setShowCreatePage(
                                        false
                                    )
                                }

                                currentRole={
                                    currentRole
                                }

                                location={
                                    location
                                }

                                logButtonEvent={
                                    logButtonEvent
                                }
                            />
                        )}

                    </div>
                )}


                {/* =================================
                    VIEW ALL
                ================================= */}

                {permissions.canViewPages && (

                    <button
                        className="header-btn green"
                        onClick={() => {

                            logButtonEvent({

                                buttonNo: "HB23",

                                buttonName:
                                    "View All Notebooks & Pages Button",

                                request: {

                                    action:
                                        "Navigate",

                                    from:
                                        location.pathname,

                                    to:
                                        "/user-homepage/view-all-notebooks-pages"
                                },

                                response: {

                                    message:
                                        "Navigating to View All Notebooks and Pages Component"
                                },

                                status: 200
                            });


                            navigate(
                                "/user-homepage/view-all-notebooks-pages"
                            );
                        }}
                    >
                        View All
                    </button>
                )}

            </div>


            {/* =================================
                CENTER SEARCH
            ================================= */}

            <div className="header-center">

                <div className="search-container">

                    <input
                        className="search-input"

                        type="text"

                        placeholder={
                            getSearchPlaceholder()
                        }

                        value={
                            searchKeyword || ""
                        }

                        onChange={e =>
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


            {/* =================================
                RIGHT SIDE
            ================================= */}

            <div className="header-right">

                {/* =================================
                    SORT
                ================================= */}

                {permissions.canSort && (

                    <div className="header-popup-container">

                        <button
                            className="header-btn gray"
                            onClick={
                                handleSortButton
                            }
                        >
                            ⬍ Sort
                        </button>


                        {showSort && (

                            <div className="header-popup">

                                <div className="popup-title">

                                    <span>

                                        {isSuperUserPage
                                            ? "Sort Notebooks"
                                            : "Sort Users"}

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
                                                    openSortDropdown ===
                                                    "sortBy"
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
                                                    {
                                                        getSortByLabel()
                                                    }
                                                </span>

                                                <span
                                                    className={`dropdown-arrow ${
                                                        openSortDropdown ===
                                                        "sortBy"
                                                            ? "arrow-up"
                                                            : ""
                                                    }`}
                                                >
                                                    ▼
                                                </span>

                                            </button>


                                            <div
                                                className={`custom-dropdown-options ${
                                                    openSortDropdown ===
                                                    "sortBy"
                                                        ? "options-open"
                                                        : ""
                                                }`}
                                            >

                                                {userSortByOptions.map(
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
                                                    openSortDropdown ===
                                                    "order"
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
                                                        openSortDropdown ===
                                                        "order"
                                                            ? "arrow-up"
                                                            : ""
                                                    }`}
                                                >
                                                    ▼
                                                </span>

                                            </button>


                                            <div
                                                className={`custom-dropdown-options ${
                                                    openSortDropdown ===
                                                    "order"
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


                                {/* SORT BUTTONS */}

                                <div className="popup-buttons">

                                    <button
                                        className="apply-btn"
                                        onClick={
                                            applySort
                                        }
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


                {/* =================================
                    FILTER
                ================================= */}

                {permissions.canFilter && (

                    <div className="header-popup-container">

                        <button
                            className="header-btn gray"
                            onClick={
                                handleFilterButton
                            }
                        >
                            ⛃ Filter
                        </button>


                        {showFilter && (

                            <div className="header-popup filter-popup">

                                <div className="popup-title">

                                    <span>

                                        {isSuperUserPage
                                            ? "Filter Notebooks"
                                            : "Filter Users"}

                                    </span>

                                </div>


                                <div className="popup-body">

                                    {/* AUTHORITIES */}

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

                                                        checked={
                                                            authorityFilter.includes(
                                                                authority
                                                            )
                                                        }

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
                                                    key={
                                                        status
                                                    }

                                                    className="checkbox-item"
                                                >

                                                    <input
                                                        type="checkbox"

                                                        checked={
                                                            statusFilter.includes(
                                                                status
                                                            )
                                                        }

                                                        onChange={() =>
                                                            toggleStatus(
                                                                status
                                                            )
                                                        }
                                                    />

                                                    <span>

                                                        {status ===
                                                        "UAC"
                                                            ? "Active"
                                                            : "Inactive"}

                                                    </span>

                                                </label>
                                            )
                                        )}

                                    </div>

                                </div>


                                {/* FILTER BUTTONS */}

                                <div className="popup-buttons">

                                    <button
                                        className="apply-btn"
                                        onClick={
                                            applyFilter
                                        }
                                    >
                                        Apply
                                    </button>
                                    <button
                                        className="reset-btn"
                                        onClick={
                                            resetFilter
                                        }
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
                    <b>{username}</b>
                </span>
                <CgProfile
                    size={24}
                    className="profile-icon"
                />
                <button
                    className="logout-btn"
                    onClick={
                        handleLogout
                    }
                >
                    Logout
                </button>
            </div>
        </header>
    );
}