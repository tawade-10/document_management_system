import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RecentPages.css";

const USER_PAGES_API =
    "http://localhost:8080/api/pages/myPages";

export default function RecentPages({ searchKeyword }) {

    const navigate = useNavigate();

    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAllPages, setShowAllPages] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchRecentPages();
    }, []);

    const fetchRecentPages = async () => {

        try {

            setLoading(true);
            setError("");

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
                    USER_PAGES_API,
                    {
                        params,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.group(
                    `UH-RP1 - Load My Pages Page ${currentPage + 1}`
                );

                console.log("Request");

                console.log({
                    method: "GET",
                    url: USER_PAGES_API,
                    params
                });

                console.log("Response");

                console.log(response.data);

                console.groupEnd();

                const content =
                    Array.isArray(response.data?.content)
                        ? response.data.content
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
                "UH-RP1 - Total My Pages Loaded:",
                allPages.length
            );

            setPages(allPages);

        } catch (error) {

            console.group("UH-RP1 - Load My Pages Error");

            console.log("Response");

            console.log(error.response?.data);

            console.groupEnd();

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to load recent pages."
            );

        } finally {

            setLoading(false);
        }
    };

    const keyword =
        searchKeyword?.trim().toLowerCase() || "";

    const filteredPages = pages.filter(page => {

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

        const createdBy =
            String(
                page.createdBy || ""
            ).toLowerCase();

        const notebookId =
            String(
                page.notebookId ||
                page.notebooks?.notebookId ||
                page.notebook?.notebookId ||
                ""
            ).toLowerCase();

        const notebookName =
            String(
                page.notebookName ||
                page.notebooks?.name ||
                page.notebook?.name ||
                ""
            ).toLowerCase();

        const pageStatus =
            String(
                page.status || ""
            ).toLowerCase();

        const participants =
            String(
                page.participants || ""
            ).toLowerCase();

        return (
            pageId.includes(keyword) ||
            pageTitle.includes(keyword) ||
            createdBy.includes(keyword) ||
            notebookId.includes(keyword) ||
            notebookName.includes(keyword) ||
            pageStatus.includes(keyword) ||
            participants.includes(keyword)
        );
    });

    const visiblePages =
        showAllPages
            ? filteredPages
            : filteredPages.slice(0, 6);

    const handlePageClick = pageId => {

        if (!pageId) {
            return;
        }

        navigate(
            `/user-homepage/view-page/${pageId}`
        );
    };

    const handleViewAll = () => {
        setShowAllPages(prev => !prev);
    };

    return (
        <div className="recent-pages-card">

            <div className="recent-pages-header">

                <div>

                    <h2>
                        Recent Pages
                    </h2>

                    <p>
                        Recently created or updated pages
                    </p>

                </div>

                <span className="recent-pages-count">
                    {filteredPages.length}
                </span>

            </div>

            {loading ? (

                <div className="recent-pages-state">

                    <div className="recent-pages-loader"></div>

                    <span>
                        Loading pages...
                    </span>

                </div>

            ) : error ? (

                <div className="recent-pages-state recent-pages-error">
                    {error}
                </div>

            ) : visiblePages.length === 0 ? (

                <div className="recent-pages-state">
                    No recent pages found.
                </div>

            ) : (

                <div
                    className={
                        showAllPages
                            ? "recent-pages-list recent-pages-list-expanded"
                            : "recent-pages-list"
                    }
                >

                    {visiblePages.map(page => {

                        const pageId =
                            page.pageId || "";

                        const pageTitle =
                            page.title ||
                            "Untitled Page";

                        const createdBy =
                            page.createdBy ||
                            "Unknown User";

                        const pageStatus =
                            page.status ||
                            "PSV";

                        const notebookId =
                            page.notebookId ||
                            page.notebooks?.notebookId ||
                            page.notebook?.notebookId ||
                            "";

                        const notebookName =
                            page.notebookName ||
                            page.notebooks?.name ||
                            page.notebook?.name ||
                            "";

                        return (

                            <button
                                type="button"
                                className="recent-page-row"
                                key={pageId}
                                onClick={() =>
                                    handlePageClick(pageId)
                                }
                            >

                                <div className="recent-page-icon">
                                    📄
                                </div>

                                <div className="recent-page-info">

                                    <span className="recent-page-title">
                                        {pageTitle}
                                    </span>

                                    <span className="recent-page-id">

                                        {pageId}

                                        {" · "}

                                        {createdBy}

                                        {notebookId && (
                                            <>
                                                {" · "}
                                                {notebookId}
                                            </>
                                        )}

                                    </span>

                                </div>

                                {notebookName && (

                                    <span className="recent-page-notebook">
                                        {notebookName}
                                    </span>

                                )}

                                <div className="recent-page-right">

                                    <span
                                        className={`recent-page-status ${String(
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

                                    <span className="recent-page-arrow">
                                        ›
                                    </span>

                                </div>

                            </button>

                        );

                    })}

                </div>

            )}

            {filteredPages.length > 6 &&
                !loading &&
                !error && (

                    <button
                        type="button"
                        className="recent-pages-view-more"
                        onClick={handleViewAll}
                    >
                        {showAllPages
                            ? "Show Less"
                            : `View All Pages (${filteredPages.length})`}
                    </button>

                )}

        </div>
    );
}