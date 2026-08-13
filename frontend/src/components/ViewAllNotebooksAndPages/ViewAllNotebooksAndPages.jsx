import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header/Header";
import "./ViewAllNotebooksAndPages.css";

const NOTEBOOKS_API =
    "http://localhost:8080/api/notebooks/allNotebooks";

const PAGES_API =
    "http://localhost:8080/api/pages";

export default function ViewAllNotebooksAndPages() {

    const [notebooks, setNotebooks] = useState([]);
    const [pagesByNotebook, setPagesByNotebook] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingPages, setLoadingPages] = useState({});
    const [error, setError] = useState("");
    const [expandedNotebook, setExpandedNotebook] = useState(null);
    const [selectedPage, setSelectedPage] = useState(null);

    const fetchNotebooks = async () => {

        const token =
            localStorage.getItem("token");

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                NOTEBOOKS_API,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            console.group(
                "NB2 - View All Notebooks"
            );

            console.log("Request");

            console.log({
                method: "GET",
                url: NOTEBOOKS_API
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

            console.group(
                "NB2 - View All Notebooks"
            );

            console.log("Request");

            console.log({
                method: "GET",
                url: NOTEBOOKS_API
            });

            console.log("Response");

            console.log(
                error.response?.data
            );

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

    const fetchPagesByNotebook = async (notebookId) => {

        const token =
            localStorage.getItem("token");

        const url =
            `${PAGES_API}/${notebookId}/pages`;

        try {

            setLoadingPages(prev => ({
                ...prev,
                [notebookId]: true
            }));

            const response = await axios.get(
                url,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            console.group(
                "NB3 - View Notebook Pages"
            );

            console.log("Request");

            console.log({
                method: "GET",
                url
            });

            console.log("Response");

            console.log(response.data);

            console.groupEnd();

            setPagesByNotebook(prev => ({
                ...prev,
                [notebookId]:
                    Array.isArray(response.data)
                        ? response.data
                        : []
            }));

        } catch (error) {

            console.group(
                "NB3 - View Notebook Pages"
            );

            console.log("Request");

            console.log({
                method: "GET",
                url
            });

            console.log("Response");

            console.log(
                error.response?.data
            );

            console.groupEnd();

            setPagesByNotebook(prev => ({
                ...prev,
                [notebookId]: []
            }));

        } finally {

            setLoadingPages(prev => ({
                ...prev,
                [notebookId]: false
            }));
        }
    };

    useEffect(() => {
        fetchNotebooks();
    }, []);

    const handleNotebookClick = async (notebookId) => {

        if (expandedNotebook === notebookId) {
            setExpandedNotebook(null);
            setSelectedPage(null);
            return;
        }

        setExpandedNotebook(notebookId);
        setSelectedPage(null);

        await fetchPagesByNotebook(
            notebookId
        );
    };

    const handlePageClick = (page) => {
        setSelectedPage(page);
    };

    return (
        <>
            <Header />

            <div className="view-all-page">

                <div className="view-all-title">
                    <h2>
                        View All Notebooks and Pages
                    </h2>
                    <p>
                        Select a notebook to view its pages
                    </p>
                </div>

                <div className="view-all-container">

                    {loading ? (

                        <div className="view-all-state">
                            <div className="state-loader"></div>
                            <span>
                                Loading notebooks...
                            </span>
                        </div>

                    ) : error ? (

                        <div className="view-all-state error-state">
                            <span>
                                {error}
                            </span>
                        </div>

                    ) : notebooks.length === 0 ? (

                        <div className="view-all-state">
                            <span>
                                No notebooks found.
                            </span>
                        </div>

                    ) : (

                        <div className="notebook-content">

                            <section className="notebooks-section">

                                <div className="section-header">

                                    <div>
                                        <h3>
                                            Notebooks
                                        </h3>

                                        <span>
                                            {notebooks.length} notebook
                                            {notebooks.length !== 1
                                                ? "s"
                                                : ""}
                                        </span>
                                    </div>

                                </div>

                                <div className="notebooks-list">

                                    {notebooks.map(
                                        notebook => {

                                            const notebookId =
                                                notebook.notebookId;

                                            const notebookName =
                                                notebook.name ||
                                                notebook.notebookName ||
                                                "Unnamed Notebook";

                                            const isExpanded =
                                                expandedNotebook ===
                                                notebookId;

                                            const pages =
                                                pagesByNotebook[
                                                    notebookId
                                                ] || [];

                                            const isLoading =
                                                loadingPages[
                                                    notebookId
                                                ] || false;

                                            return (

                                                <div
                                                    className={`notebook-card ${
                                                        isExpanded
                                                            ? "notebook-card-expanded"
                                                            : ""
                                                    }`}
                                                    key={
                                                        notebookId
                                                    }
                                                >

                                                    <button
                                                        type="button"
                                                        className="notebook-header"
                                                        onClick={() =>
                                                            handleNotebookClick(
                                                                notebookId
                                                            )
                                                        }
                                                    >

                                                        <div className="notebook-info">

                                                            <div className="notebook-icon">
                                                                📒
                                                            </div>

                                                            <div className="notebook-details">

                                                                <span className="notebook-title">
                                                                    {
                                                                        notebookName
                                                                    }
                                                                </span>

                                                                <span className="notebook-id">
                                                                    {
                                                                        notebookId
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                        <div className="notebook-header-right">

                                                            {isExpanded &&
                                                                !isLoading && (
                                                                    <span className="page-count">
                                                                        {pages.length}
                                                                    </span>
                                                                )}

                                                            <span
                                                                className={`notebook-arrow ${
                                                                    isExpanded
                                                                        ? "arrow-up"
                                                                        : ""
                                                                }`}
                                                            >
                                                                ▼
                                                            </span>

                                                        </div>

                                                    </button>

                                                    {isExpanded && (

                                                        <div className="notebook-pages">

                                                            {isLoading ? (

                                                                <div className="pages-state">

                                                                    <div className="small-loader"></div>

                                                                    <span>
                                                                        Loading pages...
                                                                    </span>

                                                                </div>

                                                            ) : pages.length === 0 ? (

                                                                <div className="pages-state empty-pages">

                                                                    <div className="empty-page-icon">
                                                                        📄
                                                                    </div>

                                                                    <span>
                                                                        No pages available
                                                                    </span>

                                                                </div>

                                                            ) : (

                                                                pages.map(
                                                                    page => {

                                                                        const isSelected =
                                                                            selectedPage?.pageId ===
                                                                            page.pageId;

                                                                        return (

                                                                            <button
                                                                                type="button"
                                                                                className={`page-card ${
                                                                                    isSelected
                                                                                        ? "page-card-selected"
                                                                                        : ""
                                                                                }`}
                                                                                key={
                                                                                    page.pageId
                                                                                }
                                                                                onClick={() =>
                                                                                    handlePageClick(
                                                                                        page
                                                                                    )
                                                                                }
                                                                            >

                                                                                <div className="page-card-icon">
                                                                                    📄
                                                                                </div>

                                                                                <div className="page-card-content">

                                                                                    <span className="page-card-title">
                                                                                        {
                                                                                            page.title
                                                                                        }
                                                                                    </span>

                                                                                    <span className="page-card-id">
                                                                                        {
                                                                                            page.pageId
                                                                                        }
                                                                                    </span>

                                                                                </div>

                                                                                <span className="page-card-arrow">
                                                                                    ›
                                                                                </span>

                                                                            </button>
                                                                        );
                                                                    }
                                                                )

                                                            )}

                                                        </div>
                                                    )}

                                                </div>
                                            );
                                        }
                                    )}

                                </div>

                            </section>

                            <section className="page-actions-section">

                                <div className="page-panel">

                                    <div className="page-panel-header">

                                        <div>
                                            <h3>
                                                Pages
                                            </h3>

                                            <span>
                                                {selectedPage
                                                    ? "Selected page"
                                                    : "Page details"}
                                            </span>
                                        </div>

                                        {selectedPage && (
                                            <span className="selected-badge">
                                                Selected
                                            </span>
                                        )}

                                    </div>

                                    <div className="page-panel-body">

                                        {selectedPage ? (

                                            <div className="selected-page-details">

                                                <div className="detail-icon">
                                                    📄
                                                </div>

                                                <h4>
                                                    {
                                                        selectedPage.title
                                                    }
                                                </h4>

                                                <span className="detail-page-id">
                                                    {
                                                        selectedPage.pageId
                                                    }
                                                </span>

                                                {selectedPage.status && (
                                                    <div className="detail-status">
                                                        {
                                                            selectedPage.status
                                                        }
                                                    </div>
                                                )}

                                                {selectedPage.createdBy && (
                                                    <div className="detail-row">
                                                        <span>
                                                            Created By
                                                        </span>

                                                        <strong>
                                                            {
                                                                selectedPage.createdBy
                                                            }
                                                        </strong>
                                                    </div>
                                                )}

                                                {selectedPage.createdAt && (
                                                    <div className="detail-row">
                                                        <span>
                                                            Created At
                                                        </span>

                                                        <strong>
                                                            {
                                                                new Date(
                                                                    selectedPage.createdAt
                                                                ).toLocaleString()
                                                            }
                                                        </strong>
                                                    </div>
                                                )}

                                            </div>

                                        ) : (

                                            <div className="page-panel-empty">

                                                <div className="panel-empty-icon">
                                                    📑
                                                </div>

                                                <h4>
                                                    No Page Selected
                                                </h4>

                                                <p>
                                                    Expand a notebook and
                                                    select a page to view
                                                    its details.
                                                </p>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </section>

                        </div>
                    )}

                </div>

            </div>
        </>
    );
}