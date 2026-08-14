import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./UserHomePage.css";

const NOTEBOOKS_API =
    "http://localhost:8080/api/notebooks/allNotebooks";

const PAGES_BY_NOTEBOOK_API =
    "http://localhost:8080/api/pages";

const USER_PAGES_API =
    "http://localhost:8080/api/pages/allPages";

export default function UserHomePage() {

    const { searchKeyword } = useOutletContext();

    const navigate = useNavigate();

    const [notebooks, setNotebooks] = useState([]);

    const [pagesByNotebook, setPagesByNotebook] =
        useState({});

    const [recentPages, setRecentPages] =
        useState([]);

    const [openNotebook, setOpenNotebook] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [loadingPages, setLoadingPages] =
        useState({});

    const [error, setError] =
        useState("");

    const token =
        localStorage.getItem("token");

    useEffect(() => {

        fetchHomeData();

    }, []);

    const fetchHomeData = async () => {

        try {

            setLoading(true);

            setError("");

            const [notebooksResponse, recentPagesResponse] =
                await Promise.all([
                    axios.get(
                        NOTEBOOKS_API,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    ),
                    axios.get(
                        USER_PAGES_API,
                        {
                            params: {
                                sortBy: "createdAt",
                                sortDir: "desc"
                            },
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    )
                ]);

            console.group(
                "UH1 - Load User Home Data"
            );

            console.log("Notebooks Request");

            console.log({
                method: "GET",
                url: NOTEBOOKS_API
            });

            console.log(
                notebooksResponse.data
            );

            console.log("Recent Pages Request");

            console.log({
                method: "GET",
                url: USER_PAGES_API,
                params: {
                    sortBy: "createdAt",
                    sortDir: "desc"
                }
            });

            console.log(
                recentPagesResponse.data
            );

            console.groupEnd();

            const notebookData =
                Array.isArray(notebooksResponse.data)
                    ? notebooksResponse.data
                    : [];

            const recentPageData =
                Array.isArray(recentPagesResponse.data)
                    ? recentPagesResponse.data
                    : [];

            setNotebooks(notebookData);

            setRecentPages(recentPageData);

        } catch (error) {

            console.group(
                "UH1 - Load User Home Data"
            );

            console.log("Response");

            console.log(
                error.response?.data
            );

            console.groupEnd();

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to load homepage data."
            );

        } finally {

            setLoading(false);
        }
    };

    const fetchPagesByNotebook = async (
        notebookId
    ) => {

        const url =
            `${PAGES_BY_NOTEBOOK_API}/${notebookId}/pages`;

        try {

            setLoadingPages(prev => ({
                ...prev,
                [notebookId]: true
            }));

            const response =
                await axios.get(
                    url,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            console.group(
                "UH2 - Load Notebook Pages"
            );

            console.log("Request");

            console.log({
                method: "GET",
                url
            });

            console.log("Response");

            console.log(
                response.data
            );

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
                "UH2 - Load Notebook Pages"
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

    const handleNotebookClick = async (
        notebookId
    ) => {

        if (
            openNotebook === notebookId
        ) {

            setOpenNotebook(null);

            return;
        }

        setOpenNotebook(notebookId);

        if (
            !Object.prototype.hasOwnProperty.call(
                pagesByNotebook,
                notebookId
            )
        ) {

            await fetchPagesByNotebook(
                notebookId
            );
        }
    };

    const handlePageClick = (
        pageId
    ) => {

        if (!pageId) {
            return;
        }

        navigate(
            `/user-homepage/view-page/${pageId}`
        );
    };

    const keyword =
        searchKeyword?.trim().toLowerCase() || "";

    const filteredNotebooks =
        notebooks
            .map(notebook => {

                const notebookId =
                    notebook.notebookId;

                const notebookName =
                    notebook.name ||
                    notebook.notebookName ||
                    "";

                const notebookMatches =
                    notebookId
                        .toLowerCase()
                        .includes(keyword) ||
                    notebookName
                        .toLowerCase()
                        .includes(keyword);

                const notebookPages =
                    pagesByNotebook[
                        notebookId
                    ] || [];

                if (!keyword) {
                    return {
                        ...notebook,
                        pages: notebookPages
                    };
                }

                const matchingPages =
                    notebookPages.filter(page => {

                        const pageId =
                            page.pageId ||
                            "";

                        const pageTitle =
                            page.title ||
                            "";

                        return (
                            pageId
                                .toLowerCase()
                                .includes(keyword) ||
                            pageTitle
                                .toLowerCase()
                                .includes(keyword)
                        );
                    });

                if (notebookMatches) {

                    return {
                        ...notebook,
                        pages: notebookPages
                    };
                }

                if (
                    matchingPages.length > 0
                ) {

                    return {
                        ...notebook,
                        pages: matchingPages
                    };
                }

                return null;

            })
            .filter(Boolean);

    const filteredRecentPages =
        recentPages.filter(page => {

            if (!keyword) {
                return true;
            }

            const pageId =
                page.pageId ||
                "";

            const pageTitle =
                page.title ||
                "";

            const pageStatus =
                page.status ||
                "";

            return (
                pageId
                    .toLowerCase()
                    .includes(keyword) ||
                pageTitle
                    .toLowerCase()
                    .includes(keyword) ||
                pageStatus
                    .toLowerCase()
                    .includes(keyword)
            );
        });

    return (

        <div className="user-home-page">

            <div className="user-home-content">

                <div className="home-section-header">

                    <div>

                        <h2>
                            My Notebooks
                        </h2>

                        <p>
                            View your notebooks and mapped pages
                        </p>

                    </div>

                    <span className="home-count">
                        {filteredNotebooks.length}
                    </span>

                </div>

                {loading ? (

                    <div className="home-state">

                        <div className="home-loader"></div>

                        <span>
                            Loading notebooks...
                        </span>

                    </div>

                ) : error ? (

                    <div className="home-state home-error">
                        {error}
                    </div>

                ) : filteredNotebooks.length === 0 ? (

                    <div className="home-state">
                        No notebooks or pages found.
                    </div>

                ) : (

                    <div className="notebooks-container">

                        {filteredNotebooks.map(
                            notebook => {

                                const notebookId =
                                    notebook.notebookId;

                                const notebookName =
                                    notebook.name ||
                                    notebook.notebookName ||
                                    "Unnamed Notebook";

                                const isOpen =
                                    openNotebook ===
                                    notebookId;

                                const pages =
                                    notebook.pages ||
                                    [];

                                const isLoading =
                                    loadingPages[
                                        notebookId
                                    ] || false;

                                return (

                                    <div
                                        className={`notebook-dropdown ${
                                            isOpen
                                                ? "notebook-open"
                                                : ""
                                        }`}
                                        key={
                                            notebookId
                                        }
                                    >

                                        <button
                                            type="button"
                                            className="notebook-dropdown-button"
                                            onClick={() =>
                                                handleNotebookClick(
                                                    notebookId
                                                )
                                            }
                                        >

                                            <div className="notebook-main-info">

                                                <div className="notebook-icon">
                                                    📒
                                                </div>

                                                <div className="notebook-text">

                                                    <span className="notebook-name">
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

                                            <div className="notebook-right-info">

                                                {isOpen &&
                                                    !isLoading && (
                                                        <span className="notebook-page-count">
                                                            {
                                                                pages.length
                                                            }
                                                        </span>
                                                    )}

                                                <span
                                                    className={`notebook-arrow ${
                                                        isOpen
                                                            ? "arrow-up"
                                                            : ""
                                                    }`}
                                                >
                                                    ▼
                                                </span>

                                            </div>

                                        </button>

                                        {isOpen && (

                                            <div className="notebook-dropdown-content">

                                                <div className="pages-header">

                                                    <span>
                                                        Pages
                                                    </span>

                                                    <span>
                                                        Status
                                                    </span>

                                                </div>

                                                {isLoading ? (

                                                    <div className="pages-state">

                                                        <div className="small-loader"></div>

                                                        <span>
                                                            Loading pages...
                                                        </span>

                                                    </div>

                                                ) : pages.length === 0 ? (

                                                    <div className="pages-state">

                                                        <span>
                                                            No pages available
                                                        </span>

                                                    </div>

                                                ) : (

                                                    pages.map(
                                                        page => {

                                                            const pageId =
                                                                page.pageId ||
                                                                "";

                                                            const pageTitle =
                                                                page.title ||
                                                                "Untitled Page";

                                                            const pageStatus =
                                                                page.status ||
                                                                "PSV";

                                                            return (

                                                                <button
                                                                    type="button"
                                                                    className="page-row"
                                                                    key={
                                                                        pageId
                                                                    }
                                                                    onClick={() =>
                                                                        handlePageClick(
                                                                            pageId
                                                                        )
                                                                    }
                                                                >

                                                                    <div className="page-info">

                                                                        <div className="page-icon">
                                                                            📄
                                                                        </div>

                                                                        <div className="page-text">

                                                                            <span className="page-title">
                                                                                {
                                                                                    pageTitle
                                                                                }
                                                                            </span>

                                                                            <span className="page-id">
                                                                                {
                                                                                    pageId
                                                                                }
                                                                            </span>

                                                                        </div>

                                                                    </div>

                                                                    <div className="page-right">

                                                                        <span
                                                                            className={`page-status ${pageStatus
                                                                                .toLowerCase()
                                                                                .replace(
                                                                                    " ",
                                                                                    "-"
                                                                                )}`}
                                                                        >
                                                                            {
                                                                                pageStatus
                                                                            }
                                                                        </span>

                                                                        <span className="page-row-arrow">
                                                                            ›
                                                                        </span>

                                                                    </div>

                                                                </button>
                                                            );
                                                        }
                                                    )

                                                )}

                                                {pages.length > 0 && (

                                                    <button
                                                        type="button"
                                                        className="notebook-view-more"
                                                        onClick={() =>
                                                            navigate(
                                                                "/user-homepage/view-all-notebooks-pages"
                                                            )
                                                        }
                                                    >
                                                        View All Pages
                                                    </button>

                                                )}

                                            </div>
                                        )}

                                    </div>
                                );
                            }
                        )}

                    </div>

                )}

                <div className="recent-pages-section">

                    <div className="home-section-header">

                        <div>

                            <h2>
                                Recent Pages
                            </h2>

                            <p>
                                Your recently created or updated pages
                            </p>

                        </div>

                        <span className="home-count">
                            {
                                filteredRecentPages.length
                            }
                        </span>

                    </div>

                    <div className="recent-pages-box">

                        <div className="recent-pages-header">

                            <span>
                                Page
                            </span>

                            <span>
                                Status
                            </span>

                        </div>

                        {filteredRecentPages.length === 0 ? (

                            <div className="recent-empty">
                                No recent pages found.
                            </div>

                        ) : (

                            filteredRecentPages
                                .slice(0, 8)
                                .map(
                                    page => {

                                        const pageId =
                                            page.pageId ||
                                            "";

                                        const pageTitle =
                                            page.title ||
                                            "Untitled Page";

                                        const pageStatus =
                                            page.status ||
                                            "PSV";

                                        return (

                                            <button
                                                type="button"
                                                className="recent-page-row"
                                                key={
                                                    pageId
                                                }
                                                onClick={() =>
                                                    handlePageClick(
                                                        pageId
                                                    )
                                                }
                                            >

                                                <div className="recent-page-info">

                                                    <div className="recent-page-icon">
                                                        📄
                                                    </div>

                                                    <div className="recent-page-text">

                                                        <span>
                                                            {
                                                                pageTitle
                                                            }
                                                        </span>

                                                        <small>
                                                            {
                                                                pageId
                                                            }
                                                        </small>

                                                    </div>

                                                </div>

                                                <div className="recent-page-right">

                                                    <span
                                                        className={`page-status ${pageStatus
                                                            .toLowerCase()
                                                            .replace(
                                                                " ",
                                                                "-"
                                                            )}`}
                                                    >
                                                        {
                                                            pageStatus
                                                        }
                                                    </span>

                                                    <span className="page-row-arrow">
                                                        ›
                                                    </span>

                                                </div>

                                            </button>
                                        );
                                    }
                                )
                        )}
                        {filteredRecentPages.length > 8 && (
                            <button
                                type="button"
                                className="recent-view-more"
                                onClick={() =>
                                    navigate(
                                        "/user-homepage/view-all-notebooks-pages"
                                    )
                                }
                            >
                                View All Pages
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}