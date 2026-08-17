import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./Header.css";
import { CgProfile } from "react-icons/cg";
import {
    FaSearch,
    FaUndo,
    FaRedo,
    FaBold,
    FaItalic,
    FaUnderline,
    FaHighlighter,
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight,
    FaListUl,
    FaListOl,
    FaTable,
    FaEllipsisH,
    FaHome,
    FaArrowLeft,
    FaUserPlus,
    FaBook,
    FaFileAlt,
    FaSort,
    FaFilter,
    FaSignOutAlt
} from "react-icons/fa";
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
    setStatusFilter,
    pageTitle = "",
    createdAt = ""
}) {
    const API_URL = "http://localhost:8080/api/auth";

    const navigate = useNavigate();
    const location = useLocation();
    const { pageId } = useParams();

    const [headerPageTitle, setHeaderPageTitle] = useState(pageTitle);
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

    const currentRole =
        localStorage.getItem("currentRole") || "USER";

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
        canToggleRole:
            !isAdmin &&
            authorities.includes("USER") &&
            authorities.includes("SUPER_USER")
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
        const fetchPageHeaderDetails = async () => {
            if (!pageId) {
                setHeaderPageTitle(pageTitle || "");
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/pages/${pageId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.group(
                    "HB33 - Load Page Header Details"
                );

                console.log("Request");

                console.log({
                    method: "GET",
                    url: `http://localhost:8080/api/pages/${pageId}`
                });

                console.log("Response");

                console.log(response.data);

                console.groupEnd();

                setHeaderPageTitle(
                    response.data?.title || ""
                );
            } catch (error) {
                console.group(
                    "HB33 - Load Page Header Details"
                );

                console.log("Response");

                console.log(error.response?.data);

                console.groupEnd();

                setHeaderPageTitle(pageTitle || "");
            }
        };

        fetchPageHeaderDetails();
    }, [pageId, pageTitle, token]);

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
                    status =>
                        !userStatusOptions.includes(status)
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
                    status =>
                        !notebookStatusOptions.includes(status)
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

    const dispatchEditorCommand = (
        command,
        value = null
    ) => {
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
                message:
                    "Editor undo command triggered"
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
                message:
                    "Editor redo command triggered"
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
        dispatchEditorCommand(
            "hiliteColor",
            "#fff59d"
        );
    };

    const handleTextColor = () => {
        dispatchEditorCommand(
            "foreColor",
            "#000000"
        );
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
        dispatchEditorCommand(
            "insertUnorderedList"
        );
    };

    const handleNumberList = () => {
        dispatchEditorCommand(
            "insertOrderedList"
        );
    };

    const handleTable = () => {
        dispatchEditorCommand(
            "insertTable"
        );
    };

    const handleFontChange = value => {
        setFontFamily(value);
        setShowFontDropdown(false);
        dispatchEditorCommand(
            "fontName",
            value
        );
    };

    const handleFontSizeChange = value => {
        setFontSize(value);
        setShowSizeDropdown(false);
        dispatchEditorCommand(
            "fontSize",
            value
        );
    };

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
        const nextState =
            !showCreateNotebook;

        setShowCreateNotebook(nextState);
        setShowCreatePage(false);
        setShowSort(false);
        setShowFilter(false);

        logButtonEvent({
            buttonNo: "HB21",
            buttonName: "Create Notebook Button",
            request: {
                action: nextState
                    ? "Open Popup"
                    : "Close Popup",
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
        const nextState =
            !showCreatePage;

        setShowCreatePage(nextState);
        setShowCreateNotebook(false);
        setShowSort(false);
        setShowFilter(false);

        logButtonEvent({
            buttonNo: "HB22",
            buttonName: "Create Page Button",
            request: {
                action: nextState
                    ? "Open Popup"
                    : "Close Popup",
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
    };

    const handleFilterButton = () => {
        setShowFilter(prev => !prev);
        setShowSort(false);
        setShowCreateNotebook(false);
        setShowCreatePage(false);
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

    return (
        <>
            <header className="header">

                <div className="header-left">

                    <button
                        type="button"
                        className="header-icon-btn"
                        data-tooltip="Home"
                        onClick={handleHome}
                    >
                        <FaHome />
                    </button>

                    <button
                        type="button"
                        className="header-icon-btn"
                        data-tooltip="Back"
                        onClick={handleBack}
                    >
                        <FaArrowLeft />
                    </button>

                    {permissions.canManageUsers && (
                        <button
                            type="button"
                            className="header-icon-btn"
                            data-tooltip="Create User"
                            onClick={() => {
                                navigate(
                                    "/admin/create-user"
                                );
                            }}
                        >
                            <FaUserPlus />
                        </button>
                    )}

                    {permissions.canCreateNotebook && (
                        <div className="header-popup-container">
                            <button
                                type="button"
                                className="header-icon-btn green-icon"
                                data-tooltip="New Notebook"
                                onClick={
                                    handleCreateNotebookButton
                                }
                            >
                                <FaBook />
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

                    {permissions.canCreatePage && (
                        <div className="header-popup-container">
                            <button
                                type="button"
                                className="header-icon-btn green-icon"
                                data-tooltip="New Page"
                                onClick={
                                    handleCreatePageButton
                                }
                            >
                                <FaFileAlt />
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

                    {pageId && (
                        <div
                            className="header-editable-page-title"
                            title={
                                headerPageTitle ||
                                "Page Name"
                            }
                        >
                            <input
                                type="text"
                                value={
                                    headerPageTitle
                                }
                                onChange={e =>
                                    setHeaderPageTitle(
                                        e.target.value
                                    )
                                }
                                placeholder="Page Name"
                            />
                        </div>
                    )}

                </div>

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

                        <FaSearch className="search-icon" />

                    </div>

                </div>

                <div className="header-right">

                    {permissions.canSort && (
                        <div className="header-popup-container">

                            <button
                                type="button"
                                className="header-icon-btn"
                                data-tooltip="Sort"
                                onClick={
                                    handleSortButton
                                }
                            >
                                <FaSort />
                            </button>

                            {showSort && (
                                <div className="header-popup">

                                    <div className="popup-title">
                                        {isAdmin
                                            ? "Sort Users"
                                            : "Sort Notebooks"}
                                    </div>

                                    <div className="popup-body">

                                        <div className="popup-section">

                                            <label>
                                                Sort By
                                            </label>

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
                                                        {
                                                            getSortByLabel()
                                                        }
                                                    </span>

                                                    <span>
                                                        ▼
                                                    </span>
                                                </button>

                                                {openSortDropdown ===
                                                    "sortBy" && (
                                                    <div className="custom-dropdown-options">
                                                        {currentSortOptions.map(
                                                            option => (
                                                                <button
                                                                    type="button"
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    className={
                                                                        sortBy ===
                                                                        option.value
                                                                            ? "custom-dropdown-option selected-option"
                                                                            : "custom-dropdown-option"
                                                                    }
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

                                            <label>
                                                Order
                                            </label>

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
                                                        {
                                                            getSortOrderLabel()
                                                        }
                                                    </span>

                                                    <span>
                                                        ▼
                                                    </span>
                                                </button>

                                                {openSortDropdown ===
                                                    "order" && (
                                                    <div className="custom-dropdown-options">
                                                        {sortOrderOptions.map(
                                                            option => (
                                                                <button
                                                                    type="button"
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    className={
                                                                        sortDir ===
                                                                        option.value
                                                                            ? "custom-dropdown-option selected-option"
                                                                            : "custom-dropdown-option"
                                                                    }
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
                                            onClick={
                                                applySort
                                            }
                                        >
                                            Apply
                                        </button>

                                        <button
                                            className="cancel-btn"
                                            onClick={() => {
                                                setShowSort(
                                                    false
                                                );
                                                setOpenSortDropdown(
                                                    null
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
                                type="button"
                                className="header-icon-btn"
                                data-tooltip="Filter"
                                onClick={
                                    handleFilterButton
                                }
                            >
                                <FaFilter />
                            </button>

                            {showFilter && (
                                <div className="header-popup filter-popup">

                                    <div className="popup-title">
                                        {isAdmin
                                            ? "Filter Users"
                                            : "Filter Notebooks"}
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
                                                        key={
                                                            status
                                                        }
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
                                                setShowFilter(
                                                    false
                                                );
                                                setOpenFilterDropdown(
                                                    null
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
                        type="button"
                        className="header-icon-btn logout-icon"
                        data-tooltip="Logout"
                        onClick={
                            handleLogout
                        }
                    >
                        <FaSignOutAlt />
                    </button>

                </div>

            </header>

            <div className="editor-toolbar">

                <div className="editor-toolbar-left">

                    <button
                        type="button"
                        className="editor-tool-button"
                        data-tooltip="Undo"
                        onClick={
                            handleEditorUndo
                        }
                    >
                        <FaUndo />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        data-tooltip="Redo"
                        onClick={
                            handleEditorRedo
                        }
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
                                setShowSizeDropdown(
                                    false
                                );
                                setShowMoreTools(
                                    false
                                );
                            }}
                        >
                            <span>
                                {fontFamily}
                            </span>

                            <span>
                                ▼
                            </span>
                        </button>

                        {showFontDropdown && (
                            <div className="editor-dropdown-menu font-menu">
                                {fontOptions.map(
                                    font => (
                                        <button
                                            type="button"
                                            key={
                                                font
                                            }
                                            className="editor-dropdown-item"
                                            style={{
                                                fontFamily:
                                                    font
                                            }}
                                            onClick={() =>
                                                handleFontChange(
                                                    font
                                                )
                                            }
                                        >
                                            {font}
                                        </button>
                                    )
                                )}
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
                                setShowFontDropdown(
                                    false
                                );
                                setShowMoreTools(
                                    false
                                );
                            }}
                        >
                            <span>
                                {fontSize}
                            </span>

                            <span>
                                ▼
                            </span>
                        </button>

                        {showSizeDropdown && (
                            <div className="editor-dropdown-menu size-menu">
                                {fontSizeOptions.map(
                                    size => (
                                        <button
                                            type="button"
                                            key={
                                                size
                                            }
                                            className="editor-dropdown-item"
                                            onClick={() =>
                                                handleFontSizeChange(
                                                    size
                                                )
                                            }
                                        >
                                            {size}
                                        </button>
                                    )
                                )}
                            </div>
                        )}

                    </div>

                    <div className="editor-divider" />

                    <button
                        type="button"
                        className="editor-tool-button"
                        data-tooltip="Bold"
                        onClick={
                            handleBold
                        }
                    >
                        <FaBold />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        data-tooltip="Italic"
                        onClick={
                            handleItalic
                        }
                    >
                        <FaItalic />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        data-tooltip="Underline"
                        onClick={
                            handleUnderline
                        }
                    >
                        <FaUnderline />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        data-tooltip="Highlight"
                        onClick={
                            handleHighlight
                        }
                    >
                        <FaHighlighter />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        data-tooltip="Text Color"
                        onClick={
                            handleTextColor
                        }
                    >
                        <MdFormatColorText />
                    </button>

                    <div className="editor-divider" />

                    <button
                        type="button"
                        className="editor-tool-button"
                        data-tooltip="Align Left"
                        onClick={
                            handleAlignLeft
                        }
                    >
                        <FaAlignLeft />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        data-tooltip="Align Center"
                        onClick={
                            handleAlignCenter
                        }
                    >
                        <FaAlignCenter />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        data-tooltip="Align Right"
                        onClick={
                            handleAlignRight
                        }
                    >
                        <FaAlignRight />
                    </button>

                    <div className="editor-divider" />

                    <button
                        type="button"
                        className="editor-tool-button"
                        data-tooltip="Bulleted List"
                        onClick={
                            handleBulletList
                        }
                    >
                        <FaListUl />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        data-tooltip="Numbered List"
                        onClick={
                            handleNumberList
                        }
                    >
                        <FaListOl />
                    </button>

                    <button
                        type="button"
                        className="editor-tool-button"
                        data-tooltip="Insert Table"
                        onClick={
                            handleTable
                        }
                    >
                        <FaTable />
                    </button>

                    <div className="editor-divider" />

                    <div className="editor-dropdown-container">

                        <button
                            type="button"
                            className="editor-tool-button"
                            data-tooltip="More"
                            onClick={() => {
                                setShowMoreTools(
                                    prev => !prev
                                );
                                setShowFontDropdown(
                                    false
                                );
                                setShowSizeDropdown(
                                    false
                                );
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

            </div>
        </>
    );
}