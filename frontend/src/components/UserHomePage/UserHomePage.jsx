import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./UserHomePage.css";

export default function UserHomePage() {

    // =========================================================
    // UNIVERSAL SEARCH FROM LAYOUT
    // =========================================================

    const {
        searchKeyword
    } = useOutletContext();


    // =========================================================
    // NOTEBOOK OPEN/CLOSE STATE
    // =========================================================

    const [openNotebook, setOpenNotebook] = useState(null);


    // =========================================================
    // TEMPORARY NOTEBOOK DATA
    // =========================================================

    const notebooks = [
        {
            id: "NA0001",
            name: "MOM Management",
            pages: [
                {
                    id: "PA0001",
                    title: "Documentation",
                    status: "Saved"
                },
                {
                    id: "PA0002",
                    title: "Page Design",
                    status: "Published"
                },
                {
                    id: "PA0003",
                    title: "Bank Card Application",
                    status: "Published"
                },
                {
                    id: "PA0004",
                    title: "Ratings App",
                    status: "Saved"
                }
            ]
        },
        {
            id: "NA0002",
            name: "Project Documentation",
            pages: [
                {
                    id: "PA0005",
                    title: "Requirement Analysis",
                    status: "Saved"
                },
                {
                    id: "PA0006",
                    title: "System Design",
                    status: "Published"
                },
                {
                    id: "PA0007",
                    title: "Database Design",
                    status: "Saved"
                }
            ]
        },
        {
            id: "NA0003",
            name: "Development",
            pages: [
                {
                    id: "PA0008",
                    title: "Spring MVC",
                    status: "Archived"
                },
                {
                    id: "PA0009",
                    title: "Spring Data JPA",
                    status: "Archived"
                },
                {
                    id: "PA0010",
                    title: "JWT Authentication",
                    status: "Saved"
                },
                {
                    id: "PA0011",
                    title: "REST API Development",
                    status: "Published"
                }
            ]
        },
        {
            id: "NA0004",
            name: "Technical Notes",
            pages: [
                {
                    id: "PA0012",
                    title: "DB Optimization",
                    status: "Published"
                },
                {
                    id: "PA0013",
                    title: "Security",
                    status: "Saved"
                },
                {
                    id: "PA0014",
                    title: "Testing",
                    status: "Saved"
                }
            ]
        }
    ];


    // =========================================================
    // RECENT PAGES
    // =========================================================

    const recentPages = [
        ["Documentation", "Saved"],
        ["Bank Card Entities", "Saved"],
        ["Design Patterns", "Published"],
        ["Security in Ratings App", "Published"],
        ["Spring MVC", "Archived"],
        ["Spring Data JPA", "Archived"],
        ["JWT Authentication", "Saved"],
        ["REST API Development", "Published"]
    ];


    // =========================================================
    // NOTEBOOK DROPDOWN
    // =========================================================

    const handleNotebookClick = (notebookId) => {

        setOpenNotebook(
            openNotebook === notebookId
                ? null
                : notebookId
        );
    };


    // =========================================================
    // UNIVERSAL SEARCH
    //
    // Search can match:
    // 1. Notebook ID
    // 2. Notebook Name
    // 3. Page ID
    // 4. Page Title
    // =========================================================

    const keyword =
        searchKeyword?.trim().toLowerCase() || "";


    const filteredNotebooks = notebooks
        .map((notebook) => {

            if (!keyword) {
                return notebook;
            }


            // Check notebook itself

            const notebookMatches =
                notebook.id.toLowerCase().includes(keyword) ||
                notebook.name.toLowerCase().includes(keyword);


            // Check pages

            const matchingPages =
                notebook.pages.filter((page) =>
                    page.id.toLowerCase().includes(keyword) ||
                    page.title.toLowerCase().includes(keyword)
                );


            // If notebook matches,
            // keep all its pages

            if (notebookMatches) {
                return notebook;
            }


            // If page matches,
            // show only matching pages

            if (matchingPages.length > 0) {
                return {
                    ...notebook,
                    pages: matchingPages
                };
            }


            // No match

            return null;

        })
        .filter(Boolean);


    // =========================================================
    // FILTER RECENT PAGES
    // =========================================================

    const filteredRecentPages = recentPages.filter(
        ([title, status]) => {

            if (!keyword) {
                return true;
            }

            return (
                title.toLowerCase().includes(keyword) ||
                status.toLowerCase().includes(keyword)
            );
        }
    );


    return (

        <div className="user-home-page">

            <div className="user-home-content">


                {/* =================================================
                    NOTEBOOKS
                    ================================================= */}

                <div className="home-section-title">
                    Notebooks
                </div>


                <div className="notebooks-container">

                    {filteredNotebooks.length === 0 ? (

                        <div className="no-notebooks-message">
                            No notebooks or pages found.
                        </div>

                    ) : (

                        filteredNotebooks.map((notebook) => {

                            const isOpen =
                                openNotebook === notebook.id;


                            return (

                                <div
                                    className={`notebook-dropdown ${
                                        isOpen
                                            ? "notebook-open"
                                            : ""
                                    }`}
                                    key={notebook.id}
                                >


                                    {/* =================================================
                                        NOTEBOOK HEADER
                                        ================================================= */}

                                    <button
                                        className="notebook-dropdown-button"
                                        onClick={() =>
                                            handleNotebookClick(
                                                notebook.id
                                            )
                                        }
                                    >

                                        <span className="notebook-name">
                                            {notebook.name}
                                        </span>


                                        <span className="notebook-id">
                                            {notebook.id}
                                        </span>


                                        <span
                                            className={`notebook-arrow ${
                                                isOpen
                                                    ? "arrow-up"
                                                    : ""
                                            }`}
                                        >
                                            ▼
                                        </span>

                                    </button>


                                    {/* =================================================
                                        PAGES
                                        ================================================= */}

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


                                            {notebook.pages.length === 0 ? (

                                                <div className="no-pages-message">
                                                    No pages available
                                                </div>

                                            ) : (

                                                notebook.pages.map(
                                                    (page) => (

                                                        <div
                                                            className="page-row"
                                                            key={page.id}
                                                        >

                                                            <span className="page-title">
                                                                {page.title}
                                                            </span>


                                                            <span
                                                                className={`page-status ${page.status
                                                                    .toLowerCase()
                                                                    .replace(
                                                                        " ",
                                                                        "-"
                                                                    )}`}
                                                            >
                                                                {page.status}
                                                            </span>

                                                        </div>

                                                    )
                                                )

                                            )}


                                            <button className="notebook-view-more">
                                                View More
                                            </button>

                                        </div>

                                    )}

                                </div>

                            );

                        })

                    )}

                </div>


                {/* =================================================
                    RECENT PAGES
                    ================================================= */}

                <div className="recent-pages-section">

                    <div className="home-section-title">
                        Recent Pages
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

                            <div className="no-pages-message">
                                No recent pages found.
                            </div>

                        ) : (

                            filteredRecentPages.map(
                                ([title, status], index) => (

                                    <div
                                        className="recent-page-row"
                                        key={index}
                                    >

                                        <span>
                                            {title}
                                        </span>

                                        <span>
                                            {status}
                                        </span>

                                    </div>

                                )
                            )

                        )}


                        <button className="recent-view-more">
                            View More
                        </button>


                    </div>

                </div>


            </div>

        </div>
    );
}