import React, { useEffect, useState } from "react";
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

    /*
     * Stores the page currently being unmapped.
     * Used to disable only that particular button.
     */
    const [unmappingPageId, setUnmappingPageId] = useState(null);

    const token = localStorage.getItem("token");

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

            const pageSize = 100;

            let currentPage = 0;
            let allNotebooks = [];
            let totalPages = 1;

            do {

                const params = {
                    page: currentPage,
                    size: pageSize,
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
                    superUser
                        ? `UH-SRN1 - Load All Notebooks Page ${currentPage + 1}`
                        : `UH-RN1 - Load My Notebooks Page ${currentPage + 1}`
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
                        : [];

                allNotebooks = [
                    ...allNotebooks,
                    ...content
                ];

                totalPages =
                    Number(response.data?.totalPages) || 1;

                currentPage++;

            } while (currentPage < totalPages);

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

            const pageSize = 100;

            let currentPage = 0;
            let allPages = [];
            let totalPages = 1;

            do {

                const params = {
                    page: currentPage,
                    size: pageSize,
                    sortBy: "createdAt",
                    sortDir: "desc"
                };

                const response = await axios.get(
                    PAGES_API,
                    {
                        params,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.group(
                    `UH-RN2 - Load Pages Page ${currentPage + 1}`
                );

                console.log("Request");

                console.log({
                    method: "GET",
                    url: PAGES_API,
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

                allPages = [
                    ...allPages,
                    ...content
                ];

                totalPages =
                    Number(response.data?.totalPages) || 1;

                currentPage++;

            } while (currentPage < totalPages);

            console.log(
                "UH-RN2 - Total Pages Loaded:",
                allPages.length
            );

            setPages(allPages);

        } catch (error) {

            console.group("UH-RN2 - Load Notebook Pages");

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

    const filteredNotebooks = notebooks.filter(notebook => {

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

    const visibleNotebooks =
        showAllNotebooks
            ? filteredNotebooks
            : filteredNotebooks.slice(0, 6);

    /* =========================================================
       NOTEBOOK ACTIONS
    ========================================================= */

    const handleViewAllNotebooks = () => {

        setShowAllNotebooks(prev => !prev);

        setExpandedNotebookId(null);
    };

    const handleNotebookClick = notebookId => {

        if (!notebookId) {
            return;
        }

        setExpandedNotebookId(prev =>
            prev === notebookId
                ? null
                : notebookId
        );
    };

    /* =========================================================
       GET PAGES OF NOTEBOOK
    ========================================================= */

    const getNotebookPages = notebookId => {

        return pages.filter(page => {

            const pageNotebookId =
                page.notebookId ||
                page.notebooks?.notebookId ||
                page.notebook?.notebookId ||
                page.notebooks?.id ||
                page.notebook?.id ||
                "";

            return String(pageNotebookId) ===
                String(notebookId);
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
       PAGE CLICK
    ========================================================= */

    const handlePageClick = pageId => {

        if (!pageId) {
            return;
        }

        navigate(
            `/user-homepage/view-page/${pageId}`
        );
    };

    /* =========================================================
       UNMAP PAGE
    ========================================================= */

    const handleUnmapPage = async (
        event,
        pageId,
        notebookId
    ) => {

        /*
         * Prevent the page row click.
         */
        event.stopPropagation();

        if (!pageId) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to unmap this page from the notebook?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setUnmappingPageId(pageId);

            console.group("UH-RN3 - Unmap Page");

            console.log("Request");

            console.log({
                method: "PUT",
                url: `${UNMAP_PAGE_API}/${pageId}`,
                pageId,
                notebookId
            });

            const response = await axios.put(
                `${UNMAP_PAGE_API}/${pageId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Response");

            console.log(response.data);

            console.groupEnd();

            /*
             * Update local page state.
             *
             * The backend has already removed the notebook
             * relationship. We now remove the notebook
             * relationship locally as well.
             */
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

            console.group("UH-RN3 - Unmap Page Error");

            console.log("Request");

            console.log({
                method: "PUT",
                url: `${UNMAP_PAGE_API}/${pageId}`,
                pageId,
                notebookId
            });

            console.log("Response");

            console.log(error.response?.data);

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

            {/* =================================================
                HEADER
            ================================================= */}

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

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="recent-notebooks-state">

                    <div className="recent-notebooks-loader"></div>

                    <span>
                        Loading notebooks...
                    </span>

                </div>

            ) : error ? (

                /* =================================================
                   ERROR
                ================================================= */

                <div className="recent-notebooks-state recent-notebooks-error">

                    {error}

                </div>

            ) : visibleNotebooks.length === 0 ? (

                /* =================================================
                   EMPTY
                ================================================= */

                <div className="recent-notebooks-state">

                    {superUser
                        ? "No notebooks found."
                        : "No recent notebooks found."}

                </div>

            ) : (

                /* =================================================
                   NOTEBOOK LIST
                ================================================= */

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

                        const isExpanded =
                            expandedNotebookId === notebookId;

                        const notebookPages =
                            getNotebookPages(notebookId);

                        return (

                            <div
                                className="recent-notebook-wrapper"
                                key={notebookId}
                            >

                                {/* =================================================
                                   NOTEBOOK ROW
                                ================================================= */}

                                <button
                                    type="button"
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

                                    <span
                                        className={`recent-notebook-arrow ${
                                            isExpanded
                                                ? "recent-notebook-arrow-open"
                                                : ""
                                        }`}
                                    >
                                        ›
                                    </span>

                                </button>

                                {/* =================================================
                                   EXPANDED PAGES
                                ================================================= */}

                                {isExpanded && (

                                    <div className="recent-notebook-pages-dropdown">

                                        {/* =================================================
                                           PAGE HEADER
                                        ================================================= */}

                                        <div className="recent-notebook-pages-header">

                                            <span>
                                                Pages
                                            </span>

                                            <span className="recent-notebook-pages-count">
                                                {notebookPages.length}
                                            </span>

                                        </div>

                                        {/* =================================================
                                           PAGE LOADING
                                        ================================================= */}

                                        {pagesLoading ? (

                                            <div className="recent-notebook-pages-state">

                                                <div className="recent-notebook-pages-loader"></div>

                                                <span>
                                                    Loading pages...
                                                </span>

                                            </div>

                                        ) : pagesError ? (

                                            /* =================================================
                                               PAGE ERROR
                                            ================================================= */

                                            <div className="recent-notebook-pages-state recent-notebook-pages-error">

                                                {pagesError}

                                            </div>

                                        ) : notebookPages.length === 0 ? (

                                            /* =================================================
                                               NO PAGES
                                            ================================================= */

                                            <div className="recent-notebook-pages-state">

                                                No pages mapped to this notebook.

                                            </div>

                                        ) : (

                                            /* =================================================
                                               PAGE LIST
                                            ================================================= */

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

                                                            {/* =================================================
                                                               PAGE MAIN CLICK AREA
                                                            ================================================= */}

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

                                                            {/* =================================================
                                                               UNMAP BUTTON
                                                            ================================================= */}

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

            {/* =================================================
                VIEW ALL
            ================================================= */}

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