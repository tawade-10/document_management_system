import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RecentNotebooks.css";

const MY_NOTEBOOKS_API =
    "http://localhost:8080/api/notebooks/myNotebooks";

const ALL_NOTEBOOKS_API =
    "http://localhost:8080/api/notebooks/allNotebooks";

const PAGES_API =
    "http://localhost:8080/api/pages/allPages";

const UNMAP_PAGE_API =
    "http://localhost:8080/api/pages/unmap";

const PAGE_SIZE = 100;
const MAX_VISIBLE_NOTEBOOKS = 6;

export default function RecentNotebooks({
    searchKeyword,
    superUser = false
}) {

    const navigate = useNavigate();

    const [notebooks, setNotebooks] = useState([]);
    const [pages, setPages] = useState([]);

    const [loading, setLoading] = useState(true);
    const [pagesLoading, setPagesLoading] = useState(true);

    const [error, setError] = useState("");
    const [pagesError, setPagesError] = useState("");

    const [showAllNotebooks, setShowAllNotebooks] = useState(false);
    const [expandedNotebookId, setExpandedNotebookId] = useState(null);

    const [unmappingPageId, setUnmappingPageId] = useState(null);

    const token = localStorage.getItem("token");

    /* =========================================================
       COMMON PAGINATION HELPER
    ========================================================= */

    const fetchAllPages = useCallback(
        async (apiUrl, consolePrefix, fallbackMessage) => {

            let currentPage = 0;
            let allData = [];
            let totalPages = 1;

            do {

                const params = {
                    page: currentPage,
                    size: PAGE_SIZE,
                    sortBy: "createdAt",
                    sortDir: "desc"
                };

                const response = await axios.get(
                    apiUrl,
                    {
                        params,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.group(
                    `${consolePrefix} - Page ${currentPage + 1}`
                );

                console.log("Request");

                console.log({
                    method: "GET",
                    url: apiUrl,
                    params
                });

                console.log("Response");

                console.log(response.data);

                console.groupEnd();

                const content =
                    Array.isArray(response.data?.content)
                        ? response.data.content
                        : Array.isArray(response.data)
                            ? response.data
                            : [];

                allData = [
                    ...allData,
                    ...content
                ];

                totalPages =
                    Number(response.data?.totalPages) || 1;

                currentPage++;

            } while (currentPage < totalPages);

            return allData;
        },
        [token]
    );

    /* =========================================================
       LOAD DATA
    ========================================================= */

    useEffect(() => {

        fetchNotebooks();
        fetchPages();

    }, [superUser]);

    /* =========================================================
       FETCH NOTEBOOKS
    ========================================================= */

    const fetchNotebooks = async () => {

        try {

            setLoading(true);
            setError("");

            const apiUrl = superUser
                ? ALL_NOTEBOOKS_API
                : MY_NOTEBOOKS_API;

            const prefix = superUser
                ? "UH-SRN1 - Load All Notebooks"
                : "UH-RN1 - Load My Notebooks";

            const allNotebooks =
                await fetchAllPages(
                    apiUrl,
                    prefix,
                    "Unable to load notebooks."
                );

            console.log(
                superUser
                    ? "UH-SRN1 - Total All Notebooks Loaded:"
                    : "UH-RN1 - Total My Notebooks Loaded:",
                allNotebooks.length
            );

            setNotebooks(allNotebooks);

        } catch (error) {

            console.group(
                superUser
                    ? "UH-SRN1 - Load All Notebooks Error"
                    : "UH-RN1 - Load My Notebooks Error"
            );

            console.log("Response");

            console.log(error.response?.data);

            console.groupEnd();

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to load notebooks."
            );

        } finally {

            setLoading(false);
        }
    };

    /* =========================================================
       FETCH PAGES
    ========================================================= */

    const fetchPages = async () => {

        try {

            setPagesLoading(true);
            setPagesError("");

            const allPages =
                await fetchAllPages(
                    PAGES_API,
                    "UH-RN2 - Load Pages",
                    "Unable to load notebook pages."
                );

            console.log(
                "UH-RN2 - Total Pages Loaded:",
                allPages.length
            );

            setPages(allPages);

        } catch (error) {

            console.group(
                "UH-RN2 - Load Notebook Pages Error"
            );

            console.log("Response");

            console.log(error.response?.data);

            console.groupEnd();

            setPagesError(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to load notebook pages."
            );

        } finally {

            setPagesLoading(false);
        }
    };

    /* =========================================================
       SEARCH
    ========================================================= */

    const keyword =
        searchKeyword?.trim().toLowerCase() || "";

    const filteredNotebooks = useMemo(() => {

        return notebooks.filter(notebook => {

            if (!keyword) {
                return true;
            }

            const notebookId =
                String(
                    notebook.notebookId || ""
                ).toLowerCase();

            const notebookName =
                String(
                    notebook.name ||
                    notebook.notebookName ||
                    ""
                ).toLowerCase();

            const createdBy =
                String(
                    notebook.createdBy || ""
                ).toLowerCase();

            const description =
                String(
                    notebook.description || ""
                ).toLowerCase();

            const status =
                String(
                    notebook.status || ""
                ).toLowerCase();

            return (
                notebookId.includes(keyword) ||
                notebookName.includes(keyword) ||
                createdBy.includes(keyword) ||
                description.includes(keyword) ||
                status.includes(keyword)
            );

        });

    }, [notebooks, keyword]);

    const visibleNotebooks =
        showAllNotebooks
            ? filteredNotebooks
            : filteredNotebooks.slice(
                0,
                MAX_VISIBLE_NOTEBOOKS
            );

    /* =========================================================
       BB59 - VIEW ALL NOTEBOOKS
    ========================================================= */

    const handleViewAllNotebooks = () => {

        const nextState = !showAllNotebooks;

        console.group("BB59 - View All Notebooks Button");

        console.log("Button Event");

        console.log({
            buttonNo: "BB59",
            buttonName: "View All Notebooks / Show Less",
            action: nextState
                ? "SHOW_ALL"
                : "SHOW_LESS",
            totalNotebooks: filteredNotebooks.length
        });

        console.log("Response");

        console.log({
            showAllNotebooks: nextState
        });

        console.groupEnd();

        setShowAllNotebooks(nextState);
        setExpandedNotebookId(null);
    };

    /* =========================================================
       BB60 - NOTEBOOK ROW
    ========================================================= */

    const handleNotebookClick = notebookId => {

        if (!notebookId) {
            return;
        }

        const nextExpanded =
            expandedNotebookId === notebookId
                ? null
                : notebookId;

        console.group("BB60 - Notebook Row Button");

        console.log("Button Event");

        console.log({
            buttonNo: "BB60",
            buttonName: "Notebook Row",
            notebookId,
            action:
                nextExpanded === null
                    ? "COLLAPSE"
                    : "EXPAND"
        });

        console.log("Response");

        console.log({
            expandedNotebookId: nextExpanded
        });

        console.groupEnd();

        setExpandedNotebookId(nextExpanded);
    };

    const NOTEBOOK_STATUS_API =
        "http://localhost:8080/api/notebooks/updateStatus";

    const [updatingNotebookId, setUpdatingNotebookId] =
        useState(null);

    const handleNotebookArchiveToggle = async (
        event,
        notebookId,
        notebookStatus
    ) => {

        event.stopPropagation();

        if (!notebookId || updatingNotebookId) {
            return;
        }

        const normalizedStatus =
            String(notebookStatus)
                .trim()
                .toUpperCase();

        const isArchived =
            normalizedStatus === "NAR";

        const action =
            isArchived
                ? "UNARCHIVE"
                : "ARCHIVE";

        const buttonName =
            isArchived
                ? "Unarchive Notebook"
                : "Archive Notebook";

        console.group(
            `Notebook ${action} Button`
        );

        console.log("Button Event");

        console.log({
            buttonNo: "Notebook Archive/Unarchive",
            buttonName,
            notebookId,
            currentStatus: normalizedStatus,
            action
        });

        console.groupEnd();

        try {

            setUpdatingNotebookId(notebookId);

            const requestUrl = `${NOTEBOOK_STATUS_API}/${notebookId}`;

            console.group(
                `Notebook ${action} API`
            );

            console.log("Request");

            console.log({
                method: "PUT",
                url: requestUrl,
                notebookId,
                currentStatus: normalizedStatus,
                action
            });

            const response =
                await axios.put(
                    requestUrl,
                    {},
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            console.log("Response");

            console.log(response.data);

            console.groupEnd();

            await fetchNotebooks();
            await fetchPages();
            setExpandedNotebookId(notebookId);

        } catch (error) {

            console.group(
                `Notebook ${action} API Error`
            );

            console.log("Request");

            console.log({
                method: "PUT",
                url:
                    `${NOTEBOOK_STATUS_API}/${notebookId}`,
                notebookId,
                currentStatus: normalizedStatus,
                action
            });
            console.log("Response");
            console.log(error.response?.data);
            console.groupEnd();
            window.alert(
                error.response?.data?.message ||
                error.response?.data ||
                `Unable to ${action.toLowerCase()} notebook.`
            );
        } finally {
            setUpdatingNotebookId(null);
        }
    };

    const getNotebookPages = notebookId => {

        return pages.filter(page => {

            const pageNotebookId =
                page.notebookId ||
                page.notebooks?.notebookId ||
                page.notebook?.notebookId ||
                page.notebooks?.id ||
                page.notebook?.id ||
                "";

            return (
                String(pageNotebookId) ===
                String(notebookId)
            );
        });
    };

    /* =========================================================
       NOTEBOOK STATUS
    ========================================================= */

    const getNotebookStatus = notebook => {

        return (
            notebook.status ||
            notebook.statusId ||
            notebook.notebookStatus ||
            "NAC"
        );
    };

    const getNotebookStatusClass = status => {

        const normalizedStatus =
            String(status)
                .toLowerCase()
                .replace(/\s+/g, "-");

        if (
            normalizedStatus === "nac" ||
            normalizedStatus.includes("active")
        ) {
            return "active";
        }

        if (
            normalizedStatus === "nar" ||
            normalizedStatus.includes("archived")
        ) {
            return "archived";
        }

        return normalizedStatus;
    };

    /* =========================================================
       BB61 - PAGE ROW
    ========================================================= */

    const handlePageClick = pageId => {

        if (!pageId) {
            return;
        }

        console.group("BB61 - Notebook Page Row Button");

        console.log("Button Event");

        console.log({
            buttonNo: "BB61",
            buttonName: "Page Row Inside Notebook",
            pageId,
            action: "VIEW_PAGE"
        });

        console.log("Response");

        console.log({
            navigationPath:
                `/user-homepage/view-page/${pageId}`
        });

        console.groupEnd();

        navigate(
            `/user-homepage/view-page/${pageId}`
        );
    };

    /* =========================================================
       BB62 - UNMAP PAGE
    ========================================================= */

    const handleUnmapPage = async (
        event,
        pageId,
        notebookId
    ) => {

        event.stopPropagation();

        if (!pageId) {
            return;
        }

        console.group("BB62 - Unmap Page Button");

        console.log("Button Event");

        console.log({
            buttonNo: "BB62",
            buttonName: "Unmap Page",
            pageId,
            notebookId
        });

        console.groupEnd();

        const confirmed = window.confirm(
            "Are you sure you want to unmap this page from the notebook?"
        );

        if (!confirmed) {

            console.group("BB62 - Unmap Page Button");

            console.log("Response");

            console.log({
                action: "CANCELLED",
                pageId,
                notebookId
            });

            console.groupEnd();

            return;
        }

        try {

            setUnmappingPageId(pageId);

            const requestUrl =
                `${UNMAP_PAGE_API}/${pageId}`;

            console.group("BB62 - Unmap Page API");

            console.log("Request");

            console.log({
                method: "PUT",
                url: requestUrl,
                pageId,
                notebookId
            });

            const response =
                await axios.put(
                    requestUrl,
                    {},
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            console.log("Response");

            console.log(response.data);

            console.groupEnd();

            setPages(prevPages =>
                prevPages.map(page => {

                    if (
                        String(page.pageId) ===
                        String(pageId)
                    ) {

                        return {
                            ...page,
                            notebookId: null,
                            notebook: null,
                            notebooks: null
                        };
                    }

                    return page;
                })
            );

        } catch (error) {

            console.group(
                "BB62 - Unmap Page Error"
            );

            console.log("Request");

            console.log({
                method: "PUT",
                url:
                    `${UNMAP_PAGE_API}/${pageId}`,
                pageId,
                notebookId
            });

            console.log("Response");

            console.log(
                error.response?.data
            );

            console.groupEnd();

            window.alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to unmap page from notebook."
            );

        } finally {

            setUnmappingPageId(null);
        }
    };

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div className="recent-notebooks-card">

            <div className="recent-notebooks-header">

                <div>

                    <h2>
                        {superUser
                            ? "All Notebooks"
                            : "Recent Notebooks"}
                    </h2>

                    <p>
                        {superUser
                            ? "All notebooks created in the system"
                            : "Recently created notebooks"}
                    </p>

                </div>

                <span className="recent-notebooks-count">
                    {filteredNotebooks.length}
                </span>

            </div>

            {loading ? (

                <div className="recent-notebooks-state">

                    <div className="recent-notebooks-loader"></div>

                    <span>
                        Loading notebooks...
                    </span>

                </div>

            ) : error ? (

                <div className="recent-notebooks-state recent-notebooks-error">
                    {error}
                </div>

            ) : visibleNotebooks.length === 0 ? (

                <div className="recent-notebooks-state">

                    {superUser
                        ? "No notebooks found."
                        : "No recent notebooks found."}

                </div>

            ) : (

                <div
                    className={
                        showAllNotebooks
                            ? "recent-notebooks-list recent-notebooks-list-expanded"
                            : "recent-notebooks-list"
                    }
                >

                    {visibleNotebooks.map(notebook => {

                        const notebookId =
                            notebook.notebookId || "";

                        const notebookName =
                            notebook.name ||
                            notebook.notebookName ||
                            "Unnamed Notebook";

                        const createdBy =
                            notebook.createdBy ||
                            "Unknown User";

                        const notebookStatus =
                            getNotebookStatus(notebook);

                        const normalizedNotebookStatus =
                            String(notebookStatus)
                                .trim()
                                .toUpperCase();

                        const isArchived =
                            normalizedNotebookStatus === "NAR";

                        const isExpanded =
                            expandedNotebookId === notebookId;

                        const notebookPages =
                            getNotebookPages(
                                notebookId
                            );

                        return (

                            <div
                                className="recent-notebook-wrapper"
                                key={notebookId}
                            >

                                <div
                                    className={`recent-notebook-row ${
                                        isExpanded
                                            ? "recent-notebook-row-expanded"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleNotebookClick(
                                            notebookId
                                        )
                                    }
                                >

                                    <div className="recent-notebook-icon">
                                        📒
                                    </div>

                                    <div className="recent-notebook-info">

                                        <span className="recent-notebook-name">
                                            {notebookName}
                                        </span>

                                        <span className="recent-notebook-id">
                                            {notebookId}
                                            {" · "}
                                            {createdBy}
                                        </span>

                                    </div>

                                    <span
                                        className={`recent-notebook-status ${getNotebookStatusClass(
                                            notebookStatus
                                        )}`}
                                    >
                                        {notebookStatus}
                                    </span>

                                    {/* =================================================
                                        ARCHIVE / UNARCHIVE BUTTON
                                    ================================================= */}

                                    {!superUser && (

                                        <button
                                            type="button"
                                            className={
                                                isArchived
                                                    ? "recent-notebook-archive-button recent-notebook-unarchive-button"
                                                    : "recent-notebook-archive-button"
                                            }
                                            onClick={event =>
                                                handleNotebookArchiveToggle(
                                                    event,
                                                    notebookId,
                                                    notebookStatus
                                                )
                                            }
                                        >
                                            {isArchived
                                                ? "Unarchive"
                                                : "Archive"}
                                        </button>

                                    )}

                                    <span
                                        className={`recent-notebook-arrow ${
                                            isExpanded
                                                ? "recent-notebook-arrow-open"
                                                : ""
                                        }`}
                                    >
                                        ›
                                    </span>

                                </div>

                                {isExpanded && (

                                    <div className="recent-notebook-pages-dropdown">

                                        <div className="recent-notebook-pages-header">

                                            <span>
                                                Pages
                                            </span>

                                            <span className="recent-notebook-pages-count">
                                                {notebookPages.length}
                                            </span>

                                        </div>

                                        {pagesLoading ? (

                                            <div className="recent-notebook-pages-state">

                                                <div className="recent-notebook-pages-loader"></div>

                                                <span>
                                                    Loading pages...
                                                </span>

                                            </div>

                                        ) : pagesError ? (

                                            <div className="recent-notebook-pages-state recent-notebook-pages-error">
                                                {pagesError}
                                            </div>

                                        ) : notebookPages.length === 0 ? (

                                            <div className="recent-notebook-pages-state">
                                                No pages mapped to this notebook.
                                            </div>

                                        ) : (

                                            <div className="recent-notebook-pages-list">

                                                {notebookPages.map(page => {

                                                    const pageId =
                                                        page.pageId || "";

                                                    const pageTitle =
                                                        page.title ||
                                                        "Untitled Page";

                                                    const pageStatus =
                                                        page.status ||
                                                        "PSV";

                                                    const isUnmapping =
                                                        String(
                                                            unmappingPageId
                                                        ) ===
                                                        String(pageId);

                                                    return (

                                                        <div
                                                            className="recent-notebook-page-row"
                                                            key={pageId}
                                                        >

                                                            <div
                                                                className="recent-notebook-page-main"
                                                                onClick={() =>
                                                                    handlePageClick(
                                                                        pageId
                                                                    )
                                                                }
                                                                role="button"
                                                                tabIndex={0}
                                                                onKeyDown={event => {

                                                                    if (
                                                                        event.key ===
                                                                        "Enter"
                                                                    ) {

                                                                        handlePageClick(
                                                                            pageId
                                                                        );
                                                                    }

                                                                }}
                                                            >

                                                                <div className="recent-notebook-page-icon">
                                                                    📄
                                                                </div>

                                                                <div className="recent-notebook-page-info">

                                                                    <span className="recent-notebook-page-title">
                                                                        {pageTitle}
                                                                    </span>

                                                                    <span className="recent-notebook-page-id">
                                                                        {pageId}
                                                                    </span>

                                                                </div>

                                                                <span
                                                                    className={`recent-notebook-page-status ${String(
                                                                        pageStatus
                                                                    )
                                                                        .toLowerCase()
                                                                        .replace(
                                                                            /\s+/g,
                                                                            "-"
                                                                        )}`}
                                                                >
                                                                    {pageStatus}
                                                                </span>

                                                                <span className="recent-notebook-page-arrow">
                                                                    ›
                                                                </span>

                                                            </div>

                                                            {!superUser && (

                                                                <button
                                                                    type="button"
                                                                    className={`recent-notebook-unmap-button ${
                                                                        isUnmapping
                                                                            ? "recent-notebook-unmap-button-loading"
                                                                            : ""
                                                                    }`}
                                                                    disabled={
                                                                        isUnmapping
                                                                    }
                                                                    onClick={event =>
                                                                        handleUnmapPage(
                                                                            event,
                                                                            pageId,
                                                                            notebookId
                                                                        )
                                                                    }
                                                                >

                                                                    {isUnmapping
                                                                        ? "Unmapping..."
                                                                        : "Unmap"}

                                                                </button>

                                                            )}

                                                        </div>

                                                    );

                                                })}

                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>

                        );

                    })}

                </div>

            )}

            {filteredNotebooks.length > 6 &&
                !loading &&
                !error && (

                    <button
                        type="button"
                        className="recent-notebooks-view-more"
                        onClick={handleViewAllNotebooks}
                    >
                        {showAllNotebooks
                            ? "Show Less"
                            : `View All Notebooks (${filteredNotebooks.length})`}
                    </button>

                )}

        </div>
    );
}