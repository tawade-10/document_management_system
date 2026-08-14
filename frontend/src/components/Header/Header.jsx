import React, { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaSearch, FaUndo, FaRedo, FaBold, FaItalic, FaUnderline, FaHighlighter, FaAlignLeft, FaAlignCenter, FaAlignRight, FaListUl, FaListOl, FaTable, FaEllipsisH, FaMicrophone, FaSave, FaPalette } from "react-icons/fa";
import { MdFormatColorText } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import ToggleButton from "../ToggleButton/ToggleButton";
import CreateNotebookPopup from "../CreateNotebookPopup/CreateNotebookPopup";
import CreatePagePopup from "../CreatePagePopup/CreatePagePopup";

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
    const [showCreateNotebook, setShowCreateNotebook] = useState(false);
    const [showCreatePage, setShowCreatePage] = useState(false);

    const [openSortDropdown, setOpenSortDropdown] = useState(null);
    const [openFilterDropdown, setOpenFilterDropdown] = useState(null);

    const [fontFamily, setFontFamily] = useState("Calibri");
    const [fontSize, setFontSize] = useState("12");
    const [showFontDropdown, setShowFontDropdown] = useState(false);
    const [showSizeDropdown, setShowSizeDropdown] = useState(false);
    const [showMoreTools, setShowMoreTools] = useState(false);

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("userName");

    const authorityString = localStorage.getItem("authority") || "";

    const authorities = authorityString
        .split(",")
        .map(role => role.trim().toUpperCase())
        .filter(Boolean);

    const currentRole = localStorage.getItem("currentRole") || "USER";

    const isAdmin = currentRole === "ADMIN";
    const isSuperUser = currentRole === "SUPER_USER";
    const isUser = currentRole === "USER";

    const permissions = {
        canManageUsers: isAdmin,
        canCreateNotebook: isUser || isSuperUser,
        canCreatePage: isUser || isSuperUser,
        canViewPages: isUser || isSuperUser,
        canSort: isAdmin || isSuperUser || isUser,
        canFilter: isAdmin || isSuperUser || isUser,
        canToggleRole: !isAdmin && authorities.includes("USER")
    };

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

    const notebookSortByOptions = [
        {
            value: "notebookId",
            label: "Notebook ID"
        },
        {
            value: "title",
            label: "Title"
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

    const authorityOptions = [
        "ADMIN",
        "SUPER_USER",
        "USER"
    ];

    const userStatusOptions = [
        "UAC",
        "UIA"
    ];

    const notebookStatusOptions = [
        "NAC",
        "NAR"
    ];

    const fontOptions = [
        "Calibri",
        "Arial",
        "Times New Roman",
        "Verdana",
        "Georgia",
        "Tahoma"
    ];

    const fontSizeOptions = [
        "8",
        "9",
        "10",
        "11",
        "12",
        "14",
        "16",
        "18",
        "20",
        "24",
        "28",
        "32"
    ];

    const currentSortOptions = isAdmin
        ? userSortByOptions
        : notebookSortByOptions;

    const currentStatusOptions = isAdmin
        ? userStatusOptions
        : notebookStatusOptions;

    const getSearchPlaceholder = () => {
        if (isAdmin) {
            return "Search Users...";
        }

        return "Search Notebooks...";
    };

    const getSortByLabel = () => {
        const selected = currentSortOptions.find(
            option => option.value === sortBy
        );

        return selected
            ? selected.label
            : currentSortOptions[0].label;
    };

    const getSortOrderLabel = () => {
        const selected = sortOrderOptions.find(
            option => option.value === sortDir
        );

        return selected
            ? selected.label
            : "A → Z";
    };

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

    useEffect(() => {
        const refresh = () => {
            forceUpdate(prev => prev + 1);
        };

        window.addEventListener("login", refresh);
        window.addEventListener("roleChanged", refresh);

        return () => {
            window.removeEventListener("login", refresh);
            window.removeEventListener("roleChanged", refresh);
        };
    }, []);

    useEffect(() => {
        setShowSort(false);
        setShowFilter(false);
        setShowCreateNotebook(false);
        setShowCreatePage(false);
        setOpenSortDropdown(null);
        setOpenFilterDropdown(null);
        setShowFontDropdown(false);
        setShowSizeDropdown(false);
        setShowMoreTools(false);
    }, [location.pathname, currentRole]);

    useEffect(() => {
        if (
            !setSortBy ||
            !setSortDir ||
            !setAuthorityFilter ||
            !setStatusFilter
        ) {
            return;
        }

        if (isAdmin) {
            if (
                !userSortByOptions.some(
                    option => option.value === sortBy
                )
            ) {
                setSortBy("userName");
            }

            if (
                statusFilter.some(
                    status => !userStatusOptions.includes(status)
                )
            ) {
                setStatusFilter([]);
            }
        } else {
            if (
                !notebookSortByOptions.some(
                    option => option.value === sortBy
                )
            ) {
                setSortBy("createdAt");
            }

            if (
                statusFilter.some(
                    status => !notebookStatusOptions.includes(status)
                )
            ) {
                setStatusFilter([]);
            }

            if (authorityFilter.length > 0) {
                setAuthorityFilter([]);
            }
        }
    }, [
        currentRole,
        isAdmin,
        sortBy,
        statusFilter,
        authorityFilter,
        setSortBy,
        setSortDir,
        setAuthorityFilter,
        setStatusFilter
    ]);

    const dispatchEditorCommand = (command, value = null) => {
        window.dispatchEvent(
            new CustomEvent("editorCommand", {
                detail: {
                    command,
                    value
                }
            })
        );
    };

    const handleEditorUndo = () => {
        dispatchEditorCommand("undo");

        logButtonEvent({
            buttonNo: "HB30",
            buttonName: "Editor Undo Button",
            request: {
                action: "undo",
                page: location.pathname
            },
            response: {
                message: "Editor undo command triggered"
            },
            status: 200
        });
    };

    const handleEditorRedo = () => {
        dispatchEditorCommand("redo");

        logButtonEvent({
            buttonNo: "HB31",
            buttonName: "Editor Redo Button",
            request: {
                action: "redo",
                page: location.pathname
            },
            response: {
                message: "Editor redo command triggered"
            },
            status: 200
        });
    };

    const handleBold = () => {
        dispatchEditorCommand("bold");
    };

    const handleItalic = () => {
        dispatchEditorCommand("italic");
    };

    const handleUnderline = () => {
        dispatchEditorCommand("underline");
    };

    const handleHighlight = () => {
        dispatchEditorCommand("hiliteColor", "#fff59d");
    };

    const handleTextColor = () => {
        dispatchEditorCommand("foreColor", "#000000");
    };

    const handleAlignLeft = () => {
        dispatchEditorCommand("justifyLeft");
    };

    const handleAlignCenter = () => {
        dispatchEditorCommand("justifyCenter");
    };

    const handleAlignRight = () => {
        dispatchEditorCommand("justifyRight");
    };

    const handleBulletList = () => {
        dispatchEditorCommand("insertUnorderedList");
    };

    const handleNumberList = () => {
        dispatchEditorCommand("insertOrderedList");
    };

    const handleTable = () => {
        dispatchEditorCommand("insertTable");
    };

    const handleFontChange = value => {
        setFontFamily(value);
        setShowFontDropdown(false);
        dispatchEditorCommand("fontName", value);
    };

    const handleFontSizeChange = value => {
        setFontSize(value);
        setShowSizeDropdown(false);
        dispatchEditorCommand("fontSize", value);
    };

    const handleSaveEditor = () => {
        window.dispatchEvent(
            new CustomEvent("editorSave")
        );

        logButtonEvent({
            buttonNo: "HB32",
            buttonName: "Editor Save Button",
            request: {
                action: "save",
                page: location.pathname
            },
            response: {
                message: "Editor save event triggered"
            },
            status: 200
        });
    };

    const handleEditorSearch = () => {
        window.dispatchEvent(
            new CustomEvent("editorSearch")
        );
    };

    const handleEditorVoice = () => {
        window.dispatchEvent(
            new CustomEvent("editorVoice")
        );
    };

    const handleHome = () => {
        const role = localStorage.getItem("currentRole") || "USER";

        if (role === "ADMIN") {
            navigate("/admin");
        } else if (role === "SUPER_USER") {
            navigate("/superuser-homepage");
        } else if (role === "USER") {
            navigate("/user-homepage");
        } else {
            navigate("/");
        }
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/user-homepage");
        }
    };

    const handleCreateNotebookButton = () => {
        const nextState = !showCreateNotebook;

        setShowCreateNotebook(nextState);
        setShowCreatePage(false);
        setShowSort(false);
        setShowFilter(false);
        setOpenSortDropdown(null);
        setOpenFilterDropdown(null);

        logButtonEvent({
            buttonNo: "HB21",
            buttonName: "Create Notebook Button",
            request: {
                action: nextState ? "Open Popup" : "Close Popup",
                from: location.pathname,
                currentRole
            },
            response: {
                message: nextState
                    ? "Create Notebook popup opened"
                    : "Create Notebook popup closed"
            },
            status: 200
        });
    };

    const handleCreatePageButton = () => {
        const nextState = !showCreatePage;

        setShowCreatePage(nextState);
        setShowCreateNotebook(false);
        setShowSort(false);
        setShowFilter(false);
        setOpenSortDropdown(null);
        setOpenFilterDropdown(null);

        logButtonEvent({
            buttonNo: "HB22",
            buttonName: "Create Page Button",
            request: {
                action: nextState ? "Open Popup" : "Close Popup",
                from: location.pathname,
                currentRole
            },
            response: {
                message: nextState
                    ? "Create Page popup opened"
                    : "Create Page popup closed"
            },
            status: 200
        });
    };

    const handleSortButton = () => {
        setShowSort(prev => !prev);
        setShowFilter(false);
        setShowCreateNotebook(false);
        setShowCreatePage(false);
        setOpenSortDropdown(null);
        setOpenFilterDropdown(null);
    };

    const handleFilterButton = () => {
        setShowFilter(prev => !prev);
        setShowSort(false);
        setShowCreateNotebook(false);
        setShowCreatePage(false);
        setOpenSortDropdown(null);
        setOpenFilterDropdown(null);
    };

    const toggleAuthority = value => {
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

    const toggleStatus = value => {
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

    const handleSortDropdown = dropdownName => {
        setOpenSortDropdown(prev =>
            prev === dropdownName
                ? null
                : dropdownName
        );
    };

    const applySort = () => {
        logButtonEvent({
            buttonNo: "HB11",
            buttonName: "Sort Button",
            request: {
                currentRole,
                sortBy,
                sortDir
            },
            response: {
                message: isAdmin
                    ? "User sorting applied"
                    : "Notebook sorting applied"
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
                currentRole,
                authorityFilter,
                statusFilter
            },
            response: {
                message: isAdmin
                    ? "User filtering applied"
                    : "Notebook filtering applied"
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

            window.dispatchEvent(
                new Event("login")
            );

            navigate("/");
        }
    };

    const hideHeaderRoutes = [
        "/",
        "/forgot-password",
        "/reset-password"
    ];

    if (hideHeaderRoutes.includes(location.pathname)) {
        return null;
    }

    return (
        <>
            <header className="header">
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
                                        to: "/admin/create-user"
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
                        <div className="header-popup-container">
                            <button
                                className="header-btn green"
                                onClick={handleCreateNotebookButton}
                            >
                                New Notebook
                            </button>

                            {showCreateNotebook && (
                                <CreateNotebookPopup
                                    onClose={() =>
                                        setShowCreateNotebook(false)
                                    }
                                    currentRole={currentRole}
                                    location={location}
                                    logButtonEvent={logButtonEvent}
                                />
                            )}
                        </div>
                    )}

                    {permissions.canCreatePage && (
                        <div className="header-popup-container">
                            <button
                                className="header-btn green"
                                onClick={handleCreatePageButton}
                            >
                                New Page
                            </button>

                            {showCreatePage && (
                                <CreatePagePopup
                                    onClose={() =>
                                        setShowCreatePage(false)
                                    }
                                    currentRole={currentRole}
                                    location={location}
                                    logButtonEvent={logButtonEvent}
                                />
                            )}
                        </div>
                    )}

                    {permissions.canViewPages && (
                        <button
                            className="header-btn green"
                            onClick={() => {
                                navigate(
                                    "/user-homepage/view-all-notebooks-pages"
                                );
                            }}
                        >
                            View All
                        </button>
                    )}
                </div>

                <div className="header-center">
                    <div className="search-container">
                        <input
                            className="search-input"
                            type="text"
                            placeholder={getSearchPlaceholder()}
                            value={searchKeyword || ""}
                            onChange={e =>
                                setSearchKeyword(e.target.value)
                            }
                        />

                        <FaSearch className="search-icon" />
                    </div>
                </div>

                <div className="header-right">
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
                                            {isAdmin
                                                ? "Sort Users"
                                                : "Sort Notebooks"}
                                        </span>
                                    </div>

                                    <div className="popup-body">
                                        <div className="popup-section">
                                            <label>Sort By</label>

                                            <div className="custom-dropdown">
                                                <button
                                                    type="button"
                                                    className="custom-dropdown-button"
                                                    onClick={() =>
                                                        handleSortDropdown(
                                                            "sortBy"
                                                        )
                                                    }
                                                >
                                                    <span>
                                                        {getSortByLabel()}
                                                    </span>

                                                    <span className="dropdown-arrow">
                                                        ▼
                                                    </span>
                                                </button>

                                                {openSortDropdown ===
                                                    "sortBy" && (
                                                    <div className="custom-dropdown-options options-open">
                                                        {currentSortOptions.map(
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
                                                )}
                                            </div>
                                        </div>

                                        <div className="popup-section">
                                            <label>Order</label>

                                            <div className="custom-dropdown">
                                                <button
                                                    type="button"
                                                    className="custom-dropdown-button"
                                                    onClick={() =>
                                                        handleSortDropdown(
                                                            "order"
                                                        )
                                                    }
                                                >
                                                    <span>
                                                        {getSortOrderLabel()}
                                                    </span>

                                                    <span className="dropdown-arrow">
                                                        ▼
                                                    </span>
                                                </button>

                                                {openSortDropdown ===
                                                    "order" && (
                                                    <div className="custom-dropdown-options options-open">
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
                                                )}
                                            </div>
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
                                            onClick={() => {
                                                setOpenSortDropdown(null);
                                                setShowSort(false);
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
                                            {isAdmin
                                                ? "Filter Users"
                                                : "Filter Notebooks"}
                                        </span>
                                    </div>

                                    <div className="popup-body">
                                        {isAdmin && (
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
                                        )}

                                        <div className="popup-section">
                                            <label>
                                                Status
                                            </label>

                                            {currentStatusOptions.map(
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
                                                            {isAdmin
                                                                ? status ===
                                                                  "UAC"
                                                                    ? "Active"
                                                                    : "Inactive"
                                                                : status ===
                                                                  "NAC"
                                                                ? "Active"
                                                                : "Archived"}
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
                                                setOpenFilterDropdown(null);
                                                setShowFilter(false);
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
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="editor-toolbar">
                <div className="editor-toolbar-left">
                    <button
                        type="button"
                        className="editor-tool-button"
                        title="Undo"
                        onClick={handleEditorUndo}
                    >
                        <FaUndo />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        title="Redo"
                        onClick={handleEditorRedo}
                    >
                        <FaRedo />
                    </button>

                    <div className="editor-divider" />

                    <div className="editor-dropdown-container">
                        <button
                            type="button"
                            className="editor-font-button"
                            onClick={() => {
                                setShowFontDropdown(
                                    prev => !prev
                                );
                                setShowSizeDropdown(false);
                                setShowMoreTools(false);
                            }}
                        >
                            <span>{fontFamily}</span>
                            <span className="editor-dropdown-arrow">
                                ▼
                            </span>
                        </button>

                        {showFontDropdown && (
                            <div className="editor-dropdown-menu font-menu">
                                {fontOptions.map(font => (
                                    <button
                                        type="button"
                                        key={font}
                                        className="editor-dropdown-item"
                                        style={{
                                            fontFamily: font
                                        }}
                                        onClick={() =>
                                            handleFontChange(font)
                                        }
                                    >
                                        {font}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="editor-dropdown-container size-container">
                        <button
                            type="button"
                            className="editor-size-button"
                            onClick={() => {
                                setShowSizeDropdown(
                                    prev => !prev
                                );
                                setShowFontDropdown(false);
                                setShowMoreTools(false);
                            }}
                        >
                            <span>{fontSize}</span>
                            <span className="editor-dropdown-arrow">
                                ▼
                            </span>
                        </button>

                        {showSizeDropdown && (
                            <div className="editor-dropdown-menu size-menu">
                                {fontSizeOptions.map(size => (
                                    <button
                                        type="button"
                                        key={size}
                                        className="editor-dropdown-item"
                                        onClick={() =>
                                            handleFontSizeChange(size)
                                        }
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="editor-divider" />

                    <button
                        type="button"
                        className="editor-tool-button editor-format-button"
                        title="Bold"
                        onClick={handleBold}
                    >
                        <FaBold />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button editor-format-button"
                        title="Italic"
                        onClick={handleItalic}
                    >
                        <FaItalic />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button editor-format-button"
                        title="Underline"
                        onClick={handleUnderline}
                    >
                        <FaUnderline />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        title="Highlight"
                        onClick={handleHighlight}
                    >
                        <FaHighlighter />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        title="Text Color"
                        onClick={handleTextColor}
                    >
                        <MdFormatColorText />
                    </button>

                    <div className="editor-divider" />

                    <button
                        type="button"
                        className="editor-tool-button"
                        title="Align Left"
                        onClick={handleAlignLeft}
                    >
                        <FaAlignLeft />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        title="Align Center"
                        onClick={handleAlignCenter}
                    >
                        <FaAlignCenter />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        title="Align Right"
                        onClick={handleAlignRight}
                    >
                        <FaAlignRight />
                    </button>

                    <div className="editor-divider" />

                    <button
                        type="button"
                        className="editor-tool-button"
                        title="Bulleted List"
                        onClick={handleBulletList}
                    >
                        <FaListUl />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        title="Numbered List"
                        onClick={handleNumberList}
                    >
                        <FaListOl />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        title="Insert Table"
                        onClick={handleTable}
                    >
                        <FaTable />
                    </button>

                    <div className="editor-divider" />

                    <div className="editor-dropdown-container">
                        <button
                            type="button"
                            className="editor-tool-button"
                            title="More"
                            onClick={() => {
                                setShowMoreTools(
                                    prev => !prev
                                );
                                setShowFontDropdown(false);
                                setShowSizeDropdown(false);
                            }}
                        >
                            <FaEllipsisH />
                        </button>

                        {showMoreTools && (
                            <div className="editor-more-menu">
                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatchEditorCommand(
                                            "removeFormat"
                                        )
                                    }
                                >
                                    Clear Formatting
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatchEditorCommand(
                                            "strikeThrough"
                                        )
                                    }
                                >
                                    Strikethrough
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatchEditorCommand(
                                            "justifyFull"
                                        )
                                    }
                                >
                                    Justify
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="editor-toolbar-right">
                    <button
                        type="button"
                        className="editor-tool-button"
                        title="Search"
                        onClick={handleEditorSearch}
                    >
                        <FaSearch />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        title="Voice"
                        onClick={handleEditorVoice}
                    >
                        <FaMicrophone />
                    </button>

                    <div className="editor-toolbar-save-container">
                        <button
                            type="button"
                            className="editor-save-button"
                            onClick={handleSaveEditor}
                        >
                            <FaSave />
                            <span>Save</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
