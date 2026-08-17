import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RecentNotebooks.css";

const NOTEBOOKS_API =
    "http://localhost:8080/api/notebooks/allNotebooks";

const PAGES_API =
    "http://localhost:8080/api/pages/allPages";

export default function RecentNotebooks({ searchKeyword }) {

    const navigate = useNavigate();

    const [notebooks, setNotebooks] = useState([]);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagesLoading, setPagesLoading] = useState(true);
    const [error, setError] = useState("");
    const [pagesError, setPagesError] = useState("");
    const [showAllNotebooks, setShowAllNotebooks] = useState(false);
    const [expandedNotebookId, setExpandedNotebookId] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchRecentNotebooks();
        fetchPages();
    }, []);

    const fetchRecentNotebooks = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                NOTEBOOKS_API,
                {
                    params: {
                        sortBy: "createdAt",
                        sortDir: "desc"
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.group("UH-RN1 - Load Recent Notebooks");

            console.log("Request");

            console.log({
                method: "GET",
                url: NOTEBOOKS_API,
                params: {
                    sortBy: "createdAt",
                    sortDir: "desc"
                }
            });

            console.log("Response");

            console.log(response.data);

            console.groupEnd();

            setNotebooks(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.group("UH-RN1 - Load Recent Notebooks");

            console.log("Response");

            console.log(error.response?.data);

            console.groupEnd();

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to load recent notebooks."
            );

        } finally {

            setLoading(false);
        }
    };

    const fetchPages = async () => {

        try {

            setPagesLoading(true);
            setPagesError("");

            const response = await axios.get(
                PAGES_API,
                {
                    params: {
                        sortBy: "createdAt",
                        sortDir: "desc"
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.group("UH-RN2 - Load Notebook Pages");

            console.log("Request");

            console.log({
                method: "GET",
                url: PAGES_API,
                params: {
                    sortBy: "createdAt",
                    sortDir: "desc"
                }
            });

            console.log("Response");

            console.log(response.data);

            console.groupEnd();

            setPages(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

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

        return (
            notebookId.includes(keyword) ||
            notebookName.includes(keyword)
        );
    });

    const visibleNotebooks = showAllNotebooks
        ? filteredNotebooks
        : filteredNotebooks.slice(0, 6);

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

    const getNotebookPages = notebookId => {

        return pages.filter(page => {

            const pageNotebookId =
                page.notebookId ||
                page.notebooks?.notebookId ||
                page.notebook?.notebookId ||
                "";

            return String(pageNotebookId) === String(notebookId);
        });
    };

    const handlePageClick = pageId => {

        if (!pageId) {
            return;
        }

        navigate(
            `/user-homepage/view-page/${pageId}`
        );
    };

    return (
        <div className="recent-notebooks-card">

            <div className="recent-notebooks-header">

                <div>
                    <h2>Recent Notebooks</h2>

                    <p>
                        Recently created notebooks
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
                    No recent notebooks found.
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

                        const isExpanded =
                            expandedNotebookId === notebookId;

                        const notebookPages =
                            getNotebookPages(notebookId);

                        return (

                            <div
                                className="recent-notebook-wrapper"
                                key={notebookId}
                            >

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
                                        </span>

                                    </div>

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

                                {isExpanded && (

                                    <div className="recent-notebook-pages-dropdown">

                                        <div className="recent-notebook-pages-header">

                                            <span>
                                                Pages
                                            </span>

                                            <span>
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

                                                    return (

                                                        <button
                                                            type="button"
                                                            className="recent-notebook-page-row"
                                                            key={pageId}
                                                            onClick={() =>
                                                                handlePageClick(
                                                                    pageId
                                                                )
                                                            }
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
                                                                className={`recent-notebook-page-status ${String(pageStatus)
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

                                                        </button>
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
                            : "View All Notebooks"}
                    </button>
                )}

        </div>
    );
}