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


    /* =========================================================
       STATE
    ========================================================= */

    const [headerPageTitle, setHeaderPageTitle] =
        useState(pageTitle);

    const [, forceUpdate] = useState(0);

    const [showSort, setShowSort] =
        useState(false);

    const [showFilter, setShowFilter] =
        useState(false);

    const [showCreateNotebook, setShowCreateNotebook] =
        useState(false);

    const [showCreatePage, setShowCreatePage] =
        useState(false);

    const [openSortDropdown, setOpenSortDropdown] =
        useState(null);

    const [openFilterDropdown, setOpenFilterDropdown] =
        useState(null);

    const [fontFamily, setFontFamily] =
        useState("Calibri");

    const [fontSize, setFontSize] =
        useState("12");

    const [showFontDropdown, setShowFontDropdown] =
        useState(false);

    const [showSizeDropdown, setShowSizeDropdown] =
        useState(false);

    const [showMoreTools, setShowMoreTools] =
        useState(false);


    /* =========================================================
       LOCAL STORAGE
    ========================================================= */

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


    const isAdmin =
        currentRole === "ADMIN";

    const isSuperUser =
        currentRole === "SUPER_USER";

    const isUser =
        currentRole === "USER";


    /* =========================================================
       PERMISSIONS
    ========================================================= */

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
            authorities.includes("USER") &&
            authorities.includes("SUPER_USER")
    };


    /* =========================================================
       SORT / FILTER OPTIONS
    ========================================================= */

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


    /* =========================================================
       EDITOR OPTIONS
    ========================================================= */

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


    const currentSortOptions =
        isAdmin
            ? userSortByOptions
            : notebookSortByOptions;


    const currentStatusOptions =
        isAdmin
            ? userStatusOptions
            : notebookStatusOptions;


    /* =========================================================
       HELPERS
    ========================================================= */

    const getSearchPlaceholder = () => {

        if (isAdmin) {
            return "Search Users...";
        }

        return "Search Notebooks...";
    };


    const getSortByLabel = () => {

        const selected =
            currentSortOptions.find(
                option =>
                    option.value === sortBy
            );

        return selected
            ? selected.label
            : currentSortOptions[0].label;
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


    /* =========================================================
       BUTTON LOGGER
    ========================================================= */

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


    /* =========================================================
       REFRESH HEADER
    ========================================================= */

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


    /* =========================================================
       PAGE HEADER DETAILS
    ========================================================= */

    useEffect(() => {

        const fetchPageHeaderDetails =
            async () => {

                if (!pageId) {

                    setHeaderPageTitle(
                        pageTitle || ""
                    );

                    return;
                }


                try {

                    const response =
                        await axios.get(
                            `http://localhost:8080/api/pages/${pageId}`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        );


                    logButtonEvent({

                        buttonNo: "HB16",

                        buttonName:
                            "Load Page Header Details",

                        request: {
                            method: "GET",
                            url:
                                `http://localhost:8080/api/pages/${pageId}`
                        },

                        response:
                            response.data,

                        status:
                            response.status
                    });


                    setHeaderPageTitle(
                        response.data?.title ||
                        ""
                    );

                } catch (error) {

                    logButtonEvent({

                        buttonNo: "HB16",

                        buttonName:
                            "Load Page Header Details",

                        request: {
                            method: "GET",
                            url:
                                `http://localhost:8080/api/pages/${pageId}`
                        },

                        response:
                            error.response?.data ||
                            error.message,

                        status:
                            error.response?.status ||
                            500
                    });


                    setHeaderPageTitle(
                        pageTitle || ""
                    );
                }
            };


        fetchPageHeaderDetails();

    }, [
        pageId,
        pageTitle,
        token
    ]);


    /* =========================================================
       CLOSE POPUPS ON NAVIGATION / ROLE CHANGE
    ========================================================= */

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

    }, [
        location.pathname,
        currentRole
    ]);


    /* =========================================================
       VALIDATE SORT / FILTER VALUES
    ========================================================= */

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
                    option =>
                        option.value === sortBy
                )
            ) {

                setSortBy(
                    "userName"
                );
            }


            if (
                statusFilter.some(
                    status =>
                        !userStatusOptions.includes(
                            status
                        )
                )
            ) {

                setStatusFilter([]);
            }

        } else {

            if (
                !notebookSortByOptions.some(
                    option =>
                        option.value === sortBy
                )
            ) {

                setSortBy(
                    "createdAt"
                );
            }


            if (
                statusFilter.some(
                    status =>
                        !notebookStatusOptions.includes(
                            status
                        )
                )
            ) {

                setStatusFilter([]);
            }


            if (
                authorityFilter.length > 0
            ) {

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


    /* =========================================================
       EDITOR COMMAND
    ========================================================= */

    const dispatchEditorCommand = (
        command,
        value = null
    ) => {

        if (!pageId) {
            return;
        }

        window.dispatchEvent(
            new CustomEvent(
                "editorCommand",
                {
                    detail: {
                        command,
                        value
                    }
                }
            )
        );
    };


    /* =========================================================
       EDITOR BUTTONS
    ========================================================= */

    const handleEditorUndo = () => {

        if (!pageId) {
            return;
        }


        dispatchEditorCommand("undo");


        logButtonEvent({

            buttonNo: "HB38",

            buttonName:
                "Editor Undo Button",

            request: {
                action: "undo",
                page:
                    location.pathname
            },

            response: {
                message:
                    "Editor undo command triggered"
            },

            status: 200
        });
    };


    const handleEditorRedo = () => {

        if (!pageId) {
            return;
        }


        dispatchEditorCommand("redo");


        logButtonEvent({

            buttonNo: "HB39",

            buttonName:
                "Editor Redo Button",

            request: {
                action: "redo",
                page:
                    location.pathname
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

        logButtonEvent({

            buttonNo: "HB44",

            buttonName:
                "Bold Button",

            request: {
                action: "bold",
                page:
                    location.pathname
            },

            response: {
                message:
                    "Bold command triggered"
            },

            status: 200
        });
    };


    const handleItalic = () => {

        dispatchEditorCommand("italic");

        logButtonEvent({

            buttonNo: "HB45",

            buttonName:
                "Italic Button",

            request: {
                action: "italic",
                page:
                    location.pathname
            },

            response: {
                message:
                    "Italic command triggered"
            },

            status: 200
        });
    };


    const handleUnderline = () => {

        dispatchEditorCommand("underline");

        logButtonEvent({

            buttonNo: "HB46",

            buttonName:
                "Underline Button",

            request: {
                action: "underline",
                page:
                    location.pathname
            },

            response: {
                message:
                    "Underline command triggered"
            },

            status: 200
        });
    };


    const handleHighlight = () => {

        dispatchEditorCommand(
            "hiliteColor",
            "#fff59d"
        );

        logButtonEvent({

            buttonNo: "HB47",

            buttonName:
                "Highlight Button",

            request: {
                action: "highlight",
                color: "#fff59d"
            },

            response: {
                message:
                    "Highlight command triggered"
            },

            status: 200
        });
    };


    const handleTextColor = () => {

        dispatchEditorCommand(
            "foreColor",
            "#000000"
        );

        logButtonEvent({

            buttonNo: "HB48",

            buttonName:
                "Text Color Button",

            request: {
                action: "textColor",
                color: "#000000"
            },

            response: {
                message:
                    "Text color command triggered"
            },

            status: 200
        });
    };


    const handleAlignLeft = () => {

        dispatchEditorCommand(
            "justifyLeft"
        );

        logButtonEvent({

            buttonNo: "HB49",

            buttonName:
                "Align Left Button",

            request: {
                action: "justifyLeft"
            },

            response: {
                message:
                    "Left alignment command triggered"
            },

            status: 200
        });
    };


    const handleAlignCenter = () => {

        dispatchEditorCommand(
            "justifyCenter"
        );

        logButtonEvent({

            buttonNo: "HB50",

            buttonName:
                "Align Center Button",

            request: {
                action: "justifyCenter"
            },

            response: {
                message:
                    "Center alignment command triggered"
            },

            status: 200
        });
    };


    const handleAlignRight = () => {

        dispatchEditorCommand(
            "justifyRight"
        );

        logButtonEvent({

            buttonNo: "HB51",

            buttonName:
                "Align Right Button",

            request: {
                action: "justifyRight"
            },

            response: {
                message:
                    "Right alignment command triggered"
            },

            status: 200
        });
    };


    const handleBulletList = () => {

        dispatchEditorCommand(
            "insertUnorderedList"
        );

        logButtonEvent({

            buttonNo: "HB52",

            buttonName:
                "Bulleted List Button",

            request: {
                action:
                    "insertUnorderedList"
            },

            response: {
                message:
                    "Bulleted list command triggered"
            },

            status: 200
        });
    };


    const handleNumberList = () => {

        dispatchEditorCommand(
            "insertOrderedList"
        );

        logButtonEvent({

            buttonNo: "HB53",

            buttonName:
                "Numbered List Button",

            request: {
                action:
                    "insertOrderedList"
            },

            response: {
                message:
                    "Numbered list command triggered"
            },

            status: 200
        });
    };


    const handleTable = () => {

        dispatchEditorCommand(
            "insertTable"
        );

        logButtonEvent({

            buttonNo: "HB54",

            buttonName:
                "Insert Table Button",

            request: {
                action:
                    "insertTable"
            },

            response: {
                message:
                    "Insert table command triggered"
            },

            status: 200
        });
    };


    /* =========================================================
       FONT
    ========================================================= */

    const handleFontDropdown = () => {

        const nextState =
            !showFontDropdown;


        setShowFontDropdown(
            nextState
        );

        setShowSizeDropdown(false);

        setShowMoreTools(false);


        logButtonEvent({

            buttonNo: "HB40",

            buttonName:
                "Font Family Dropdown Button",

            request: {
                action:
                    nextState
                        ? "Open Dropdown"
                        : "Close Dropdown"
            },

            response: {
                message:
                    nextState
                        ? "Font family dropdown opened"
                        : "Font family dropdown closed"
            },

            status: 200
        });
    };


    const handleFontChange = value => {

        setFontFamily(value);

        setShowFontDropdown(false);

        dispatchEditorCommand(
            "fontName",
            value
        );


        logButtonEvent({

            buttonNo: "HB41",

            buttonName:
                "Font Family Option Button",

            request: {
                action: "Select Font",
                font: value
            },

            response: {
                message:
                    "Font family selected",
                font: value
            },

            status: 200
        });
    };


    /* =========================================================
       FONT SIZE
    ========================================================= */

    const handleSizeDropdown = () => {

        const nextState =
            !showSizeDropdown;


        setShowSizeDropdown(
            nextState
        );

        setShowFontDropdown(false);

        setShowMoreTools(false);


        logButtonEvent({

            buttonNo: "HB42",

            buttonName:
                "Font Size Dropdown Button",

            request: {
                action:
                    nextState
                        ? "Open Dropdown"
                        : "Close Dropdown"
            },

            response: {
                message:
                    nextState
                        ? "Font size dropdown opened"
                        : "Font size dropdown closed"
            },

            status: 200
        });
    };


    const handleFontSizeChange = value => {

        setFontSize(value);

        setShowSizeDropdown(false);

        dispatchEditorCommand(
            "fontSize",
            value
        );


        logButtonEvent({

            buttonNo: "HB43",

            buttonName:
                "Font Size Option Button",

            request: {
                action: "Select Font Size",
                size: value
            },

            response: {
                message:
                    "Font size selected",
                size: value
            },

            status: 200
        });
    };


    /* =========================================================
       HOME
    ========================================================= */

    const handleHome = () => {

        const role =
            localStorage.getItem(
                "currentRole"
            ) || "USER";


        let destination;


        if (role === "ADMIN") {

            destination = "/admin";

        } else if (
            role === "SUPER_USER"
        ) {

            destination =
                "/superuser-homepage";

        } else if (
            role === "USER"
        ) {

            destination =
                "/user-homepage";

        } else {

            destination = "/";
        }


        logButtonEvent({

            buttonNo: "HB16",

            buttonName:
                "Home Button",

            request: {
                action: "Navigate Home",
                from:
                    location.pathname,
                currentRole: role
            },

            response: {
                message:
                    "Navigating Home",
                destination
            },

            status: 200
        });


        navigate(destination);
    };


    /* =========================================================
       BACK
    ========================================================= */

    const handleBack = () => {

        logButtonEvent({

            buttonNo: "HB17",

            buttonName:
                "Back Button",

            request: {
                action: "Navigate Back",
                from:
                    location.pathname
            },

            response: {
                message:
                    window.history.length > 1
                        ? "Navigating to previous page"
                        : "No previous history. Navigating to User Home"
            },

            status: 200
        });


        if (
            window.history.length > 1
        ) {

            navigate(-1);

        } else {

            navigate(
                "/user-homepage"
            );
        }
    };


    /* =========================================================
       CREATE USER
    ========================================================= */

    const handleCreateUser = () => {

        logButtonEvent({

            buttonNo: "HB18",

            buttonName:
                "Create User Button",

            request: {
                action: "Navigate",
                from:
                    location.pathname,
                destination:
                    "/admin/create-user"
            },

            response: {
                message:
                    "Navigating to Create User"
            },

            status: 200
        });


        navigate(
            "/admin/create-user"
        );
    };


    /* =========================================================
       CREATE NOTEBOOK
    ========================================================= */

    const handleCreateNotebookButton = () => {

        const nextState =
            !showCreateNotebook;


        setShowCreateNotebook(
            nextState
        );

        setShowCreatePage(false);

        setShowSort(false);

        setShowFilter(false);


        logButtonEvent({

            buttonNo: "HB19",

            buttonName:
                "New Notebook Button",

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


    /* =========================================================
       CREATE PAGE
    ========================================================= */

    const handleCreatePageButton = () => {

        const nextState =
            !showCreatePage;


        setShowCreatePage(
            nextState
        );

        setShowCreateNotebook(false);

        setShowSort(false);

        setShowFilter(false);


        logButtonEvent({

            buttonNo: "HB20",

            buttonName:
                "New Page Button",

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


    /* =========================================================
       SEARCH
    ========================================================= */

    const handleSearchChange = e => {

        const value =
            e.target.value;


        setSearchKeyword(value);


        logButtonEvent({

            buttonNo: "HB21",

            buttonName:
                "Search Field / Search Button",

            request: {
                action:
                    isAdmin
                        ? "Search Users"
                        : "Search Notebooks",

                keyword: value,

                currentRole
            },

            response: {
                message:
                    "Search keyword updated",
                keyword: value
            },

            status: 200
        });
    };


    /* =========================================================
       SORT
    ========================================================= */

    const handleSortButton = () => {

        const nextState =
            !showSort;


        setShowSort(
            nextState
        );

        setShowFilter(false);

        setShowCreateNotebook(false);

        setShowCreatePage(false);


        logButtonEvent({

            buttonNo: "HB22",

            buttonName:
                "Sort Button",

            request: {
                action:
                    nextState
                        ? "Open Sort"
                        : "Close Sort",

                currentRole,

                page:
                    location.pathname
            },

            response: {
                message:
                    nextState
                        ? "Sort popup opened"
                        : "Sort popup closed"
            },

            status: 200
        });
    };


    const handleSortDropdown =
        dropdownName => {

            const nextState =
                openSortDropdown === dropdownName
                    ? null
                    : dropdownName;


            setOpenSortDropdown(
                nextState
            );


            logButtonEvent({

                buttonNo:
                    dropdownName === "sortBy"
                        ? "HB23"
                        : "HB24",

                buttonName:
                    dropdownName === "sortBy"
                        ? "Sort By Dropdown Button"
                        : "Sort Order Dropdown Button",

                request: {
                    action:
                        nextState
                            ? "Open Dropdown"
                            : "Close Dropdown",

                    dropdown:
                        dropdownName
                },

                response: {
                    message:
                        "Sort dropdown toggled"
                },

                status: 200
            });
        };


    const applySort = () => {

        logButtonEvent({

            buttonNo: "HB27",

            buttonName:
                "Apply Sort Button",

            request: {
                currentRole,
                sortBy,
                sortDir
            },

            response: {
                message:
                    isAdmin
                        ? "User sorting applied"
                        : "Notebook sorting applied"
            },

            status: 200
        });


        setOpenSortDropdown(null);

        setShowSort(false);
    };


    const cancelSort = () => {

        logButtonEvent({

            buttonNo: "HB28",

            buttonName:
                "Cancel Sort Button",

            request: {
                currentRole,
                sortBy,
                sortDir,
                action:
                    "Cancel Sort"
            },

            response: {
                message:
                    "Sort popup cancelled"
            },

            status: 200
        });


        setShowSort(false);

        setOpenSortDropdown(null);
    };


    /* =========================================================
       FILTER
    ========================================================= */

    const handleFilterButton = () => {

        const nextState =
            !showFilter;


        setShowFilter(
            nextState
        );

        setShowSort(false);

        setShowCreateNotebook(false);

        setShowCreatePage(false);


        logButtonEvent({

            buttonNo: "HB29",

            buttonName:
                "Filter Button",

            request: {
                action:
                    nextState
                        ? "Open Filter"
                        : "Close Filter",

                currentRole,

                page:
                    location.pathname
            },

            response: {
                message:
                    nextState
                        ? "Filter popup opened"
                        : "Filter popup closed"
            },

            status: 200
        });
    };


    const toggleAuthority = value => {

        let updatedFilter;


        if (
            authorityFilter.includes(value)
        ) {

            updatedFilter =
                authorityFilter.filter(
                    item =>
                        item !== value
                );

        } else {

            updatedFilter = [
                ...authorityFilter,
                value
            ];
        }


        setAuthorityFilter(
            updatedFilter
        );


        logButtonEvent({

            buttonNo: "HB30",

            buttonName:
                "Authority Filter Checkbox",

            request: {
                action:
                    authorityFilter.includes(value)
                        ? "Uncheck"
                        : "Check",

                authority: value,

                currentSelection:
                    updatedFilter
            },

            response: {
                message:
                    "Authority filter updated"
            },

            status: 200
        });
    };


    const toggleStatus = value => {

        let updatedFilter;


        if (
            statusFilter.includes(value)
        ) {

            updatedFilter =
                statusFilter.filter(
                    item =>
                        item !== value
                );

        } else {

            updatedFilter = [
                ...statusFilter,
                value
            ];
        }


        setStatusFilter(
            updatedFilter
        );


        logButtonEvent({

            buttonNo: "HB31",

            buttonName:
                "Status Filter Checkbox",

            request: {
                action:
                    statusFilter.includes(value)
                        ? "Uncheck"
                        : "Check",

                status: value,

                currentSelection:
                    updatedFilter
            },

            response: {
                message:
                    "Status filter updated"
            },

            status: 200
        });
    };


    const applyFilter = () => {

        logButtonEvent({

            buttonNo: "HB32",

            buttonName:
                "Apply Filter Button",

            request: {
                currentRole,
                authorityFilter,
                statusFilter
            },

            response: {
                message:
                    isAdmin
                        ? "User filtering applied"
                        : "Notebook filtering applied"
            },

            status: 200
        });


        setOpenFilterDropdown(null);

        setShowFilter(false);
    };


    const resetFilter = () => {

        logButtonEvent({

            buttonNo: "HB33",

            buttonName:
                "Reset Filter Button",

            request: {
                currentRole,

                previousAuthorityFilter:
                    authorityFilter,

                previousStatusFilter:
                    statusFilter
            },

            response: {
                message:
                    "Filters reset successfully"
            },

            status: 200
        });


        setAuthorityFilter([]);

        setStatusFilter([]);

        setOpenFilterDropdown(null);
    };


    const cancelFilter = () => {

        logButtonEvent({

            buttonNo: "HB34",

            buttonName:
                "Cancel Filter Button",

            request: {
                currentRole,
                authorityFilter,
                statusFilter,
                action:
                    "Cancel Filter"
            },

            response: {
                message:
                    "Filter popup cancelled"
            },

            status: 200
        });


        setShowFilter(false);

        setOpenFilterDropdown(null);
    };


    /* =========================================================
       PROFILE
    ========================================================= */

    const handleProfile = () => {

        logButtonEvent({

            buttonNo: "HB36",

            buttonName:
                "Profile Button",

            request: {
                action:
                    "Profile Click",

                currentRole,

                userName:
                    username
            },

            response: {
                message:
                    "Profile button clicked"
            },

            status: 200
        });
    };


    /* =========================================================
       LOGOUT
    ========================================================= */

    const handleLogout = async () => {

        const request = {

            method: "POST",

            url:
                `${API_URL}/logout`,

            currentRole
        };


        try {

            const response =
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


            logButtonEvent({

                buttonNo: "HB37",

                buttonName:
                    "Logout Button",

                request,

                response:
                    response.data,

                status:
                    response.status
            });


            toast.success(
                "Logged out successfully."
            );

        } catch (error) {

            logButtonEvent({

                buttonNo: "HB37",

                buttonName:
                    "Logout Button",

                request,

                response:
                    error.response?.data ||
                    error.message,

                status:
                    error.response?.status ||
                    500
            });


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


    /* =========================================================
       MORE TOOLS
    ========================================================= */

    const handleMoreTools = () => {

        const nextState =
            !showMoreTools;


        setShowMoreTools(
            nextState
        );

        setShowFontDropdown(false);

        setShowSizeDropdown(false);


        logButtonEvent({

            buttonNo: "HB55",

            buttonName:
                "More Tools Button",

            request: {
                action:
                    nextState
                        ? "Open More Tools"
                        : "Close More Tools"
            },

            response: {
                message:
                    nextState
                        ? "More tools menu opened"
                        : "More tools menu closed"
            },

            status: 200
        });
    };


    const handleClearFormatting = () => {

        dispatchEditorCommand(
            "removeFormat"
        );


        logButtonEvent({

            buttonNo: "HB56",

            buttonName:
                "Clear Formatting Button",

            request: {
                action:
                    "removeFormat"
            },

            response: {
                message:
                    "Clear formatting command triggered"
            },

            status: 200
        });
    };


    const handleStrikethrough = () => {

        dispatchEditorCommand(
            "strikeThrough"
        );


        logButtonEvent({

            buttonNo: "HB57",

            buttonName:
                "Strikethrough Button",

            request: {
                action:
                    "strikeThrough"
            },

            response: {
                message:
                    "Strikethrough command triggered"
            },

            status: 200
        });
    };


    const handleJustify = () => {

        dispatchEditorCommand(
            "justifyFull"
        );


        logButtonEvent({

            buttonNo: "HB58",

            buttonName:
                "Justify Button",

            request: {
                action:
                    "justifyFull"
            },

            response: {
                message:
                    "Justify command triggered"
            },

            status: 200
        });
    };


    /* =========================================================
       HIDDEN HEADER ROUTES
    ========================================================= */

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


    /* =========================================================
       JSX
    ========================================================= */

    return (
        <>

            {/* =================================================
                MAIN HEADER
            ================================================= */}

            <header className="header">

                {/* ================= LEFT ================= */}

                <div className="header-left">

                    {/* HB16 */}
                    <button
                        type="button"
                        className="header-icon-btn"
                        data-tooltip="Home"
                        onClick={handleHome}
                    >
                        <FaHome />
                    </button>


                    {/* HB17 */}
                    <button
                        type="button"
                        className="header-icon-btn"
                        data-tooltip="Back"
                        onClick={handleBack}
                    >
                        <FaArrowLeft />
                    </button>


                    {/* HB18 */}
                    {permissions.canManageUsers && (

                        <button
                            type="button"
                            className="header-icon-btn"
                            data-tooltip="Create User"
                            onClick={handleCreateUser}
                        >
                            <FaUserPlus />
                        </button>

                    )}


                    {/* HB19 */}
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


                    {/* HB20 */}
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


                    {/* PAGE TITLE */}

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


                {/* ================= CENTER ================= */}

                <div className="header-center">

                    <div className="search-container">

                        {/* HB21 */}
                        <input
                            className="search-input"
                            type="text"
                            placeholder={
                                getSearchPlaceholder()
                            }
                            value={
                                searchKeyword || ""
                            }
                            onChange={
                                handleSearchChange
                            }
                        />


                        <FaSearch
                            className="search-icon"
                        />

                    </div>

                </div>


                {/* ================= RIGHT ================= */}

                <div className="header-right">

                    {/* =================================================
                        HB22 - SORT
                    ================================================= */}

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

                                        {/* SORT BY */}

                                        <div className="popup-section">

                                            <label>
                                                Sort By
                                            </label>


                                            <div className="custom-dropdown">

                                                {/* HB23 */}
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

                                                                /* HB25 */
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


                                                                        logButtonEvent({

                                                                            buttonNo:
                                                                                "HB25",

                                                                            buttonName:
                                                                                "Sort By Option Button",

                                                                            request: {
                                                                                action:
                                                                                    "Select Sort By",
                                                                                value:
                                                                                    option.value
                                                                            },

                                                                            response: {
                                                                                message:
                                                                                    "Sort By option selected"
                                                                            },

                                                                            status: 200
                                                                        });

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


                                        {/* ORDER */}

                                        <div className="popup-section">

                                            <label>
                                                Order
                                            </label>


                                            <div className="custom-dropdown">

                                                {/* HB24 */}
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

                                                                /* HB26 */
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


                                                                        logButtonEvent({

                                                                            buttonNo:
                                                                                "HB26",

                                                                            buttonName:
                                                                                "Sort Order Option Button",

                                                                            request: {
                                                                                action:
                                                                                    "Select Sort Order",
                                                                                value:
                                                                                    option.value
                                                                            },

                                                                            response: {
                                                                                message:
                                                                                    "Sort order selected"
                                                                            },

                                                                            status: 200
                                                                        });

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

                                        {/* HB27 */}
                                        <button
                                            type="button"
                                            className="apply-btn"
                                            onClick={
                                                applySort
                                            }
                                        >
                                            Apply
                                        </button>


                                        {/* HB28 */}
                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={
                                                cancelSort
                                            }
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

                    )}


                    {/* =================================================
                        HB29 - FILTER
                    ================================================= */}

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

                                        {/* AUTHORITY */}

                                        {isAdmin && (

                                            <div className="popup-section">

                                                <label>
                                                    Authorities
                                                </label>


                                                {authorityOptions.map(
                                                    authority => (

                                                        /* HB30 */
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

                                        )}


                                        {/* STATUS */}

                                        <div className="popup-section">

                                            <label>
                                                Status
                                            </label>


                                            {currentStatusOptions.map(
                                                status => (

                                                    /* HB31 */
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

                                        {/* HB32 */}
                                        <button
                                            type="button"
                                            className="apply-btn"
                                            onClick={
                                                applyFilter
                                            }
                                        >
                                            Apply
                                        </button>


                                        {/* HB33 */}
                                        <button
                                            type="button"
                                            className="reset-btn"
                                            onClick={
                                                resetFilter
                                            }
                                        >
                                            Reset
                                        </button>


                                        {/* HB34 */}
                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={
                                                cancelFilter
                                            }
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

                    )}


                    {/* =================================================
                        HB35 - ROLE TOGGLE
                    ================================================= */}

                    {permissions.canToggleRole && (

                        <div
                            onClick={() =>
                                logButtonEvent({

                                    buttonNo:
                                        "HB35",

                                    buttonName:
                                        "Toggle Role Button",

                                    request: {
                                        action:
                                            "Toggle Role",

                                        currentRole
                                    },

                                    response: {
                                        message:
                                            "Role toggle clicked"
                                    },

                                    status: 200
                                })
                            }
                        >
                            <ToggleButton />
                        </div>

                    )}


                    {/* USER */}

                    <span className="welcome-user">

                        Welcome,&nbsp;

                        <b>
                            {username}
                        </b>

                    </span>


                    {/* =================================================
                        HB36 - PROFILE
                    ================================================= */}

                    <CgProfile
                        size={24}
                        className="profile-icon"
                        onClick={
                            handleProfile
                        }
                        title="Profile"
                    />


                    {/* =================================================
                        HB37 - LOGOUT
                    ================================================= */}

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


            {/* =====================================================
                EDITOR TOOLBAR
            ===================================================== */}

            {pageId && (

                <div className="editor-toolbar">

                    <div className="editor-toolbar-left">

                        {/* HB38 */}
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


                        {/* HB39 */}
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


                        {/* =================================================
                            HB40 - FONT FAMILY
                        ================================================= */}

                        <div className="editor-dropdown-container">

                            <button
                                type="button"
                                className="editor-font-button"
                                onClick={
                                    handleFontDropdown
                                }
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

                                            /* HB41 */
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
                                                {
                                                    font
                                                }
                                            </button>

                                        )
                                    )}

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            HB42 - FONT SIZE
                        ================================================= */}

                        <div className="editor-dropdown-container size-container">

                            <button
                                type="button"
                                className="editor-size-button"
                                onClick={
                                    handleSizeDropdown
                                }
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

                                            /* HB43 */
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
                                                {
                                                    size
                                                }
                                            </button>

                                        )
                                    )}

                                </div>

                            )}

                        </div>


                        <div className="editor-divider" />


                        {/* HB44 */}
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


                        {/* HB45 */}
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


                        {/* HB46 */}
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


                        {/* HB47 */}
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


                        {/* HB48 */}
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


                        {/* HB49 */}
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


                        {/* HB50 */}
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


                        {/* HB51 */}
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


                        {/* HB52 */}
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


                        {/* HB53 */}
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


                        {/* HB54 */}
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


                        {/* =================================================
                            HB55 - MORE
                        ================================================= */}

                        <div className="editor-dropdown-container">

                            <button
                                type="button"
                                className="editor-tool-button"
                                data-tooltip="More"
                                onClick={
                                    handleMoreTools
                                }
                            >
                                <FaEllipsisH />
                            </button>


                            {showMoreTools && (

                                <div className="editor-more-menu">

                                    {/* HB56 */}
                                    <button
                                        type="button"
                                        onClick={
                                            handleClearFormatting
                                        }
                                    >
                                        Clear Formatting
                                    </button>


                                    {/* HB57 */}
                                    <button
                                        type="button"
                                        onClick={
                                            handleStrikethrough
                                        }
                                    >
                                        Strikethrough
                                    </button>


                                    {/* HB58 */}
                                    <button
                                        type="button"
                                        onClick={
                                            handleJustify
                                        }
                                    >
                                        Justify
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}