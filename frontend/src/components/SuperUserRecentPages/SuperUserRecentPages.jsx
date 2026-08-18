import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SuperUserRecentPages.css";

const ALL_PAGES_API =
    "http://localhost:8080/api/pages/allPages";

export default function SuperUserRecentPages({
    searchKeyword
}) {

    const navigate = useNavigate();

    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAllPages, setShowAllPages] = useState(false);

    const token =
        localStorage.getItem("token");

    useEffect(() => {

        fetchPages();

    }, []);

    const fetchPages = async () => {

        if (!token) {

            navigate("/");

            return;
        }

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

                const response =
                    await axios.get(
                        ALL_PAGES_API,
                        {
                            params,
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                console.group(
                    `UH-SRP1 - Load All Pages ${currentPage + 1}`
                );

                console.log("Request");

                console.log({
                    method: "GET",
                    url: ALL_PAGES_API,
                    params
                });

                console.log("Response");

                console.log(response.data);

                console.log("Status Code");

                console.log(response.status);

                console.groupEnd();

                const content =
                    Array.isArray(
                        response.data?.content
                    )
                        ? response.data.content
                        : [];

                allPages = [
                    ...allPages,
                    ...content
                ];

                totalPages =
                    Number(
                        response.data?.totalPages
                    ) || 1;

                currentPage++;

            } while (
                currentPage < totalPages
            );

            console.log(
                "UH-SRP1 - Total All Pages Loaded:",
                allPages.length
            );

            setPages(allPages);

        } catch (error) {

            console.group(
                "UH-SRP1 - Load All Pages Error"
            );

            console.log("Request");

            console.log({
                method: "GET",
                url: ALL_PAGES_API
            });

            console.log("Response");

            console.log(
                error.response?.data
            );

            console.log("Status Code");

            console.log(
                error.response?.status
            );

            console.groupEnd();

            if (
                error.response?.status === 401
            ) {

                localStorage.clear();

                navigate("/");

                return;
            }

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to load pages."
            );

        } finally {

            setLoading(false);
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

            const title =
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

            const status =
                String(
                    page.status || ""
                ).toLowerCase();

            const participants =
                Array.isArray(page.participants)
                    ? page.participants
                        .join(" ")
                        .toLowerCase()
                    : String(
                        page.participants || ""
                    ).toLowerCase();

            return (
                pageId.includes(keyword) ||
                title.includes(keyword) ||
                createdBy.includes(keyword) ||
                notebookId.includes(keyword) ||
                notebookName.includes(keyword) ||
                status.includes(keyword) ||
                participants.includes(keyword)
            );
        });

    const visiblePages =
        showAllPages
            ? filteredPages
            : filteredPages.slice(0, 6);

    const handleViewAllPages = () => {

        setShowAllPages(
            previous => !previous
        );
    };

    const handlePageClick = pageId => {

        if (!pageId) {
            return;
        }

        localStorage.setItem(
            "pageViewMode",
            "SUPER_USER"
        );

        navigate(
            `/user-homepage/view-page/${pageId}`
        );
    };

    const getStatusLabel = status => {

        const statusMap = {
            PSV: "PSV",
            PPB: "PPB",
            PSA: "PSA",
            PPA: "PPA"
        };

        return (
            statusMap[status] ||
            status ||
            "Unknown"
        );
    };

    return (
        <div className="superuser-recent-pages-card">

            <div className="superuser-recent-pages-header">

                <div>

                    <h2>
                        All Pages
                    </h2>

                    <p>
                        All pages created in the system
                    </p>

                </div>

                <span className="superuser-recent-pages-count">
                    {filteredPages.length}
                </span>

            </div>

            {loading ? (

                <div className="superuser-recent-pages-state">

                    <div className="superuser-recent-pages-loader"></div>

                    <span>
                        Loading pages...
                    </span>

                </div>

            ) : error ? (

                <div className="superuser-recent-pages-state superuser-recent-pages-error">
                    {error}
                </div>

            ) : visiblePages.length === 0 ? (

                <div className="superuser-recent-pages-state">
                    No pages found.
                </div>

            ) : (

                <div
                    className={
                        showAllPages
                            ? "superuser-recent-pages-list superuser-recent-pages-list-expanded"
                            : "superuser-recent-pages-list"
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
                                className="superuser-recent-page-row"
                                key={pageId}
                                onClick={() =>
                                    handlePageClick(pageId)
                                }
                            >

                                <div className="superuser-recent-page-icon">
                                    📄
                                </div>

                                <div className="superuser-recent-page-info">

                                    <span className="superuser-recent-page-title">
                                        {pageTitle}
                                    </span>

                                    <span className="superuser-recent-page-id">

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

                                    <span className="superuser-recent-page-notebook">
                                        {notebookName}
                                    </span>

                                )}

                                <span
                                    className={
                                        `superuser-recent-page-status ${String(
                                            pageStatus
                                        )
                                            .toLowerCase()
                                            .replace(
                                                /\s+/g,
                                                "-"
                                            )}`
                                    }
                                >
                                    {getStatusLabel(
                                        pageStatus
                                    )}
                                </span>

                                <span className="superuser-recent-page-arrow">
                                    ›
                                </span>

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
                        className="superuser-recent-pages-view-more"
                        onClick={
                            handleViewAllPages
                        }
                    >
                        {showAllPages
                            ? "Show Less"
                            : `View All Pages (${filteredPages.length})`}
                    </button>

                )}

        </div>
    );
}