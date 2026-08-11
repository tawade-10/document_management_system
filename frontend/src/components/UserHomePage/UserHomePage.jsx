import React, { useState } from "react";
import Header from "../Header/Header";
import "./UserHomePage.css";

const notebooks = [
    {
        id: "NA0001",
        name: "MOM Management",
        pages: [
            { id: "PA0001", title: "Documentation", status: "Saved" },
            { id: "PA0002", title: "Page Design", status: "Published" },
            { id: "PA0003", title: "Bank Card Application", status: "Published" },
            { id: "PA0004", title: "Ratings App", status: "Saved" }
        ]
    },
    {
        id: "NA0002",
        name: "Project Documentation",
        pages: [
            { id: "PA0005", title: "Requirement Analysis", status: "Saved" },
            { id: "PA0006", title: "System Design", status: "Published" },
            { id: "PA0007", title: "Database Design", status: "Saved" }
        ]
    },
    {
        id: "NA0003",
        name: "Development",
        pages: [
            { id: "PA0008", title: "Spring MVC", status: "Archived" },
            { id: "PA0009", title: "Spring Data JPA", status: "Archived" },
            { id: "PA0010", title: "JWT Authentication", status: "Saved" },
            { id: "PA0011", title: "REST API Development", status: "Published" }
        ]
    },
    {
        id: "NA0004",
        name: "Technical Notes",
        pages: [
            { id: "PA0012", title: "DB Optimization", status: "Published" },
            { id: "PA0013", title: "Security", status: "Saved" },
            { id: "PA0014", title: "Testing", status: "Saved" }
        ]
    }
];

export default function UserHomePage() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortDir, setSortDir] = useState("desc");
    const [authorityFilter, setAuthorityFilter] = useState([]);
    const [statusFilter, setStatusFilter] = useState([]);
    const [openNotebook, setOpenNotebook] = useState(null);

    const handleNotebookClick = (notebookId) => {
        setOpenNotebook(
            openNotebook === notebookId
                ? null
                : notebookId
        );
    };

    return (
        <>
            <Header
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortDir={sortDir}
                setSortDir={setSortDir}
                authorityFilter={authorityFilter}
                setAuthorityFilter={setAuthorityFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            <div className="user-home-page">
                <div className="user-home-content">
{/*                     <div className="user-home-title"> */}
{/*                         User Home Page */}
{/*                     </div> */}

                    <div className="home-section-title">
                        Notebooks
                    </div>

                    <div className="notebooks-container">
                        {notebooks.map((notebook) => {
                            const isOpen =
                                openNotebook === notebook.id;

                            return (
                                <div
                                    className={`notebook-dropdown ${
                                        isOpen ? "notebook-open" : ""
                                    }`}
                                    key={notebook.id}
                                >
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

                                    {isOpen && (
                                        <div className="notebook-dropdown-content">
                                            <div className="pages-header">
                                                <span>Pages</span>
                                                <span>Status</span>
                                            </div>

                                            {notebook.pages.map((page) => (
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
                                            ))}

                                            <button className="notebook-view-more">
                                                View More
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="recent-pages-section">
                        <div className="home-section-title">
                            Recent Pages
                        </div>

                        <div className="recent-pages-box">
                            <div className="recent-pages-header">
                                <span>Page</span>
                                <span>Status</span>
                            </div>

                            {[
                                ["Documentation", "Saved"],
                                ["Bank Card Entities", "Saved"],
                                ["Design Patterns", "Published"],
                                ["Security in Ratings App", "Published"],
                                ["Spring MVC", "Archived"],
                                ["Spring Data JPA", "Archived"],
                                ["JWT Authentication", "Saved"],
                                ["REST API Development", "Published"]
                            ].map(([title, status], index) => (
                                <div
                                    className="recent-page-row"
                                    key={index}
                                >
                                    <span>{title}</span>
                                    <span>{status}</span>
                                </div>
                            ))}

                            <button className="recent-view-more">
                                View More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}