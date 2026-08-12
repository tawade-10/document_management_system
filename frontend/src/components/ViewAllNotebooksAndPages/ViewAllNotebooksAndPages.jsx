import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header/Header";
import "./ViewAllNotebooksAndPages.css";

const API_URL = "http://localhost:8080/api/notebooks/allNotebooks";

export default function ViewAllNotebooksAndPages() {

    const [notebooks, setNotebooks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // Stores the notebook that is currently expanded
    const [expandedNotebook, setExpandedNotebook] = useState(null);


    const fetchNotebooks = async () => {

        const token = localStorage.getItem("token");

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                API_URL,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.group("NB2 - View All Notebooks");

            console.log("Request");

            console.log({
                method: "GET",
                url: API_URL
            });

            console.log("Response");

            console.log(response.data);

            console.groupEnd();

            setNotebooks(response.data);

        } catch (error) {

            console.group("NB2 - View All Notebooks");

            console.log("Request");

            console.log({
                method: "GET",
                url: API_URL
            });

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


    useEffect(() => {

        fetchNotebooks();

    }, []);


    /*
     * Handles notebook dropdown
     */
    const handleNotebookClick = (notebookId) => {

        setExpandedNotebook(prev =>
            prev === notebookId
                ? null
                : notebookId
        );
    };


    return (
        <>
            <Header />

            <div className="view-all-page">

                {/* ============================= */}
                {/* PAGE TITLE */}
                {/* ============================= */}

                <div className="view-all-title">

                    <h2>
                        View All Notebooks and Pages
                    </h2>

                </div>


                {/* ============================= */}
                {/* MAIN CONTAINER */}
                {/* ============================= */}

                <div className="view-all-container">

                    {loading ? (

                        <div className="view-all-message">
                            Loading notebooks...
                        </div>

                    ) : error ? (

                        <div className="view-all-error">
                            {error}
                        </div>

                    ) : notebooks.length === 0 ? (

                        <div className="view-all-message">
                            No notebooks found.
                        </div>

                    ) : (

                        <div className="notebook-content">

                            {/* ============================= */}
                            {/* NOTEBOOKS */}
                            {/* ============================= */}

                            <div className="notebooks-section">

                                <div className="notebooks-heading">
                                    Notebooks
                                </div>


                                <div className="notebooks-list">

                                    {notebooks.map((notebook) => {

                                        const isExpanded =
                                            expandedNotebook ===
                                            notebook.notebookId;

                                        return (

                                            <div
                                                className="notebook-block"
                                                key={
                                                    notebook.notebookId
                                                }
                                            >

                                                {/* ============================= */}
                                                {/* NOTEBOOK NAME */}
                                                {/* ============================= */}

                                                <button
                                                    type="button"
                                                    className={`notebook-name ${
                                                        isExpanded
                                                            ? "notebook-name-expanded"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleNotebookClick(
                                                            notebook.notebookId
                                                        )
                                                    }
                                                >

                                                    <span>
                                                        {notebook.name}
                                                    </span>

                                                    <span
                                                        className={`notebook-arrow ${
                                                            isExpanded
                                                                ? "arrow-up"
                                                                : ""
                                                        }`}
                                                    >
                                                        ▼
                                                    </span>

                                                </button>


                                                {/* ============================= */}
                                                {/* DROPDOWN CONTENT */}
                                                {/* ============================= */}

                                                {isExpanded && (

                                                    <div className="notebook-pages">

                                                        {/*
                                                         * Pages will be rendered
                                                         * here once Page API is
                                                         * implemented.
                                                         */}

                                                        <div className="no-pages">
                                                            No pages available
                                                        </div>

                                                    </div>

                                                )}

                                            </div>

                                        );

                                    })}

                                </div>

                            </div>


                            {/* ============================= */}
                            {/* RIGHT SIDE */}
                            {/* ============================= */}

                            <div className="page-actions-section">

                                <div className="page-actions-title">
                                    Pages
                                </div>

                                <div className="no-pages-right">
                                    Select a notebook to view its pages.
                                </div>

                            </div>

                        </div>

                    )}

                </div>

            </div>
        </>
    );
}