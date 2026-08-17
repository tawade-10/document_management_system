import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./UnmappedPages.css";

const USER_PAGES_API =
    "http://localhost:8080/api/pages/allPages";

const NOTEBOOKS_API =
    "http://localhost:8080/api/notebooks/allNotebooks";

const MAP_PAGE_API =
    "http://localhost:8080/api/pages";

export default function UnmappedPages({ searchKeyword }) {

    const navigate = useNavigate();

    const [pages, setPages] = useState([]);
    const [notebooks, setNotebooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingNotebooks, setLoadingNotebooks] = useState(false);
    const [error, setError] = useState("");
    const [openDropdown, setOpenDropdown] = useState(null);
    const [mappingPageId, setMappingPageId] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUnmappedPages();
    }, []);

    const fetchUnmappedPages = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                USER_PAGES_API,
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

            console.group("UH-UP1 - Load Unmapped Pages");

            console.log("Request");

            console.log({
                method: "GET",
                url: USER_PAGES_API,
                params: {
                    sortBy: "createdAt",
                    sortDir: "desc"
                }
            });

            console.log("Response");

            console.log(response.data);

            console.groupEnd();

            const allPages =
                Array.isArray(response.data)
                    ? response.data
                    : [];

            const unmappedPages =
                allPages.filter(page => {

                    const notebookId =
                        page.notebookId;

                    return (
                        notebookId === null ||
                        notebookId === undefined ||
                        String(notebookId).trim() === ""
                    );
                });

            setPages(unmappedPages);

        } catch (error) {

            console.group("UH-UP1 - Load Unmapped Pages");

            console.log("Response");

            console.log(error.response?.data);

            console.groupEnd();

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to load unmapped pages."
            );

        } finally {

            setLoading(false);
        }
    };

    const fetchNotebooks = async () => {

        try {

            setLoadingNotebooks(true);

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

            console.group("UH-UP2 - Load Notebooks For Mapping");

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

            console.group("UH-UP2 - Load Notebooks For Mapping");

            console.log("Response");

            console.log(error.response?.data);

            console.groupEnd();

            toast.error(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to load notebooks."
            );

        } finally {

            setLoadingNotebooks(false);
        }
    };

    const handleMapButtonClick = async (event, pageId) => {

        event.stopPropagation();

        if (openDropdown === pageId) {
            setOpenDropdown(null);
            return;
        }

        setOpenDropdown(pageId);

        if (notebooks.length === 0) {
            await fetchNotebooks();
        }
    };

    const handleNotebookSelect = async (
        event,
        pageId,
        notebookId
    ) => {

        event.stopPropagation();

        if (!pageId || !notebookId) {
            return;
        }

        try {

            setMappingPageId(pageId);

            console.group("UH-UP3 - Map Page To Notebook");

            console.log("Request");

            console.log({
                method: "PUT",
                url: `${MAP_PAGE_API}/${pageId}/notebook/${notebookId}`,
                pageId,
                notebookId
            });

            const response = await axios.put(
                `${MAP_PAGE_API}/${pageId}/notebook/${notebookId}`,
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

            setPages(prevPages =>
                prevPages.filter(
                    page => page.pageId !== pageId
                )
            );

            setOpenDropdown(null);

            toast.success("Page mapped to notebook successfully.");

        } catch (error) {

            console.group("UH-UP3 - Map Page To Notebook");

            console.log("Response");

            console.log(error.response?.data);

            console.groupEnd();

            toast.error(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to map page to notebook."
            );

        } finally {

            setMappingPageId(null);
        }
    };

    const keyword =
        searchKeyword?.trim().toLowerCase() || "";

    const filteredPages =
        pages.filter(page => {

            if (!keyword) {
                return true;
            }

            const pageId =
                String(
                    page.pageId || ""
                ).toLowerCase();

            const pageTitle =
                String(
                    page.title || ""
                ).toLowerCase();

            const pageStatus =
                String(
                    page.status || ""
                ).toLowerCase();

            return (
                pageId.includes(keyword) ||
                pageTitle.includes(keyword) ||
                pageStatus.includes(keyword)
            );
        });

    const visiblePages =
        filteredPages.slice(0, 6);

    const handlePageClick = pageId => {

        if (!pageId) {
            return;
        }

        navigate(
            `/user-homepage/view-page/${pageId}`
        );
    };

    return (
        <div className="unmapped-pages-card">

            <div className="unmapped-pages-header">

                <div>
                    <h2>Unmapped Pages</h2>

                    <p>
                        Pages not mapped to a notebook
                    </p>
                </div>

                <span className="unmapped-pages-count">
                    {filteredPages.length}
                </span>

            </div>

            {loading ? (

                <div className="unmapped-pages-state">

                    <div className="unmapped-pages-loader"></div>

                    <span>
                        Loading unmapped pages...
                    </span>

                </div>

            ) : error ? (

                <div className="unmapped-pages-state unmapped-pages-error">
                    {error}
                </div>

            ) : visiblePages.length === 0 ? (

                <div className="unmapped-pages-state">
                    No unmapped pages found.
                </div>

            ) : (

                <div className="unmapped-pages-list">

                    {visiblePages.map(page => {

                        const pageId =
                            page.pageId || "";

                        const pageTitle =
                            page.title ||
                            "Untitled Page";

                        const pageStatus =
                            page.status ||
                            "PSV";

                        const isDropdownOpen =
                            openDropdown === pageId;

                        const isMapping =
                            mappingPageId === pageId;

                        return (

                            <div
                                className="unmapped-page-wrapper"
                                key={pageId}
                            >

                                <button
                                    type="button"
                                    className="unmapped-page-row"
                                    onClick={() =>
                                        handlePageClick(pageId)
                                    }
                                >

                                    <div className="unmapped-page-icon">
                                        📄
                                    </div>

                                    <div className="unmapped-page-info">

                                        <span className="unmapped-page-title">
                                            {pageTitle}
                                        </span>

                                        <span className="unmapped-page-id">
                                            {pageId}
                                        </span>

                                    </div>

                                    <div className="unmapped-page-right">

                                        <span
                                            className={`unmapped-page-status ${String(pageStatus)
                                                .toLowerCase()
                                                .replace(/\s+/g, "-")}`}
                                        >
                                            {pageStatus}
                                        </span>

                                        <button
                                            type="button"
                                            className="unmapped-page-map-button"
                                            onClick={event =>
                                                handleMapButtonClick(
                                                    event,
                                                    pageId
                                                )
                                            }
                                        >
                                            {isMapping
                                                ? "Mapping..."
                                                : "Map"}
                                        </button>

                                        <span className="unmapped-page-arrow">
                                            ›
                                        </span>

                                    </div>

                                </button>

                                {isDropdownOpen && (

                                    <div
                                        className="unmapped-page-dropdown"
                                        onClick={event =>
                                            event.stopPropagation()
                                        }
                                    >

                                        <div className="unmapped-page-dropdown-title">
                                            Select Notebook
                                        </div>

                                        {loadingNotebooks ? (

                                            <div className="unmapped-page-dropdown-loading">

                                                <div className="unmapped-pages-loader"></div>

                                                <span>
                                                    Loading notebooks...
                                                </span>

                                            </div>

                                        ) : notebooks.length === 0 ? (

                                            <div className="unmapped-page-dropdown-empty">
                                                No notebooks available.
                                            </div>

                                        ) : (

                                            <div className="unmapped-page-notebook-list">

                                                {notebooks.map(notebook => {

                                                    const notebookId =
                                                        notebook.notebookId || "";

                                                    const notebookName =
                                                        notebook.name ||
                                                        notebook.notebookName ||
                                                        "Unnamed Notebook";

                                                    return (

                                                        <button
                                                            type="button"
                                                            className="unmapped-page-notebook-option"
                                                            key={notebookId}
                                                            disabled={isMapping}
                                                            onClick={event =>
                                                                handleNotebookSelect(
                                                                    event,
                                                                    pageId,
                                                                    notebookId
                                                                )
                                                            }
                                                        >

                                                            <span className="unmapped-page-notebook-icon">
                                                                📒
                                                            </span>

                                                            <span className="unmapped-page-notebook-info">

                                                                <span className="unmapped-page-notebook-name">
                                                                    {notebookName}
                                                                </span>

                                                                <span className="unmapped-page-notebook-id">
                                                                    {notebookId}
                                                                </span>

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

            {filteredPages.length > 6 && (
                <button
                    type="button"
                    className="unmapped-pages-view-more"
                >
                    View All Unmapped Pages
                </button>
            )}

        </div>
    );
}