import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./CreatePagePopup.css";

const CREATE_PAGE_API = "http://localhost:8080/api/pages/create";
const NOTEBOOKS_API = "http://localhost:8080/api/notebooks/allNotebooks";

export default function CreatePagePopup({ onClose, onCreate }) {

    const navigate = useNavigate();

    const [pageTitle, setPageTitle] = useState("");
    const [notebookSearch, setNotebookSearch] = useState("");
    const [selectedNotebook, setSelectedNotebook] = useState(null);
    const [notebooks, setNotebooks] = useState([]);

    const [showNotebookResults, setShowNotebookResults] =
        useState(false);

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);
    const [loadingNotebooks, setLoadingNotebooks] = useState(false);

    const notebookSearchRef = useRef(null);

    useEffect(() => {
        fetchNotebooks();
    }, []);

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                notebookSearchRef.current &&
                !notebookSearchRef.current.contains(event.target)
            ) {
                setShowNotebookResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);

    const fetchNotebooks = async () => {

        const token = localStorage.getItem("token");

        try {

            setLoadingNotebooks(true);

            const response = await axios.get(
                NOTEBOOKS_API,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.group("PG1 - Load Notebooks");

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

            console.group("PG1 - Load Notebooks");

            console.log("Request");

            console.log({
                method: "GET",
                url: NOTEBOOKS_API
            });

            console.log("Response");

            console.log(error.response?.data);

            console.groupEnd();

            toast.error(
                error.response?.data?.message ||
                "Unable to load notebooks."
            );

        } finally {

            setLoadingNotebooks(false);
        }
    };

    const filteredNotebooks = notebooks.filter((notebook) => {

        const notebookName =
            notebook.name ||
            notebook.notebookName ||
            "";

        return notebookName
            .toLowerCase()
            .includes(
                notebookSearch
                    .trim()
                    .toLowerCase()
            );
    });

    const validate = () => {

        const temp = {};

        if (!pageTitle.trim()) {

            temp.pageTitle =
                "Page Title is required";

        } else if (
            pageTitle.trim().length > 200
        ) {

            temp.pageTitle =
                "Page Title cannot exceed 200 characters";
        }

        setErrors(temp);

        return Object.keys(temp).length === 0;
    };

    const handlePageTitleChange = (e) => {

        const value = e.target.value;

        setPageTitle(value);

        setErrors(prev => ({
            ...prev,
            pageTitle: ""
        }));
    };

    const handleNotebookSearch = (e) => {

        const value = e.target.value;

        setNotebookSearch(value);

        setSelectedNotebook(null);

        setErrors(prev => ({
            ...prev,
            notebook: ""
        }));

        setShowNotebookResults(true);
    };

    const handleSelectNotebook = (notebook) => {

        const notebookName =
            notebook.name ||
            notebook.notebookName ||
            "";

        setSelectedNotebook(notebook);

        setNotebookSearch(notebookName);

        setShowNotebookResults(false);

        setErrors(prev => ({
            ...prev,
            notebook: ""
        }));
    };

    const handleClearNotebook = () => {

        setNotebookSearch("");

        setSelectedNotebook(null);

        setShowNotebookResults(false);

        setErrors(prev => ({
            ...prev,
            notebook: ""
        }));
    };

    const handleReset = () => {

        setPageTitle("");

        setNotebookSearch("");

        setSelectedNotebook(null);

        setErrors({});

        setShowNotebookResults(false);
    };

    const handleCreate = async () => {

        if (!validate()) {
            return;
        }

        const token = localStorage.getItem("token");

        const notebookId =
            selectedNotebook?.notebookId ||
            selectedNotebook?.id ||
            null;

        const payload = {
            title: pageTitle.trim(),
            notebookId: notebookId
        };

        try {

            setLoading(true);

            console.group("PG2 - Create Page");

            console.log("Request");

            console.log({
                method: "POST",
                url: CREATE_PAGE_API,
                payload
            });

            const response = await axios.post(
                CREATE_PAGE_API,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Response");

            console.log(response.data);

            console.log("Status Code");

            console.log(response.status);

            console.groupEnd();

            toast.success(
                "Page created successfully."
            );

            if (onCreate) {
                onCreate(response.data);
            }

            const createdPageId =
                response.data?.pageId;

            onClose();

            if (createdPageId) {

                navigate(
                    `/user-homepage/view-page/${createdPageId}`,
                    {
                        state: {
                            refresh: true,
                            created: true
                        }
                    }
                );

            } else {

                navigate(
                    "/user-homepage/view-all-notebooks-pages",
                    {
                        state: {
                            refresh: true
                        }
                    }
                );
            }

        } catch (error) {

            console.group("PG2 - Create Page");

            console.log("Request");

            console.log(payload);

            console.log("Response");

            console.log(error.response?.data);

            console.log("Status Code");

            console.log(error.response?.status);

            console.groupEnd();

            toast.error(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to create page."
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="create-page-popup">

            <div className="create-page-popup-title">
                Create Page
            </div>

            <div className="create-page-popup-body">

                <div className="create-page-field">

                    <label>
                        Page Title
                    </label>

                    <input
                        type="text"
                        placeholder="Enter page title"
                        value={pageTitle}
                        onChange={handlePageTitleChange}
                        maxLength={200}
                        disabled={loading}
                    />

                    {errors.pageTitle && (
                        <span className="create-page-error">
                            {errors.pageTitle}
                        </span>
                    )}

                </div>

                <div
                    className="create-page-field"
                    ref={notebookSearchRef}
                >

                    <label>
                        Notebook
                    </label>

                    <div className="notebook-search-wrapper">

                        <input
                            type="text"
                            placeholder={
                                loadingNotebooks
                                    ? "Loading notebooks..."
                                    : "Search notebook name (optional)"
                            }
                            value={notebookSearch}
                            onChange={handleNotebookSearch}
                            onFocus={() => {

                                if (!loadingNotebooks) {
                                    setShowNotebookResults(true);
                                }
                            }}
                            disabled={
                                loading ||
                                loadingNotebooks
                            }
                        />

                        {notebookSearch &&
                            !loading &&
                            !loadingNotebooks && (
                                <button
                                    type="button"
                                    className="clear-notebook-btn"
                                    onClick={handleClearNotebook}
                                >
                                    ×
                                </button>
                            )}

                        {showNotebookResults &&
                            !loadingNotebooks && (

                                <div className="notebook-results">

                                    {filteredNotebooks.length > 0 ? (

                                        filteredNotebooks.map(
                                            (notebook) => {

                                                const notebookId =
                                                    notebook.notebookId ||
                                                    notebook.id;

                                                const notebookName =
                                                    notebook.name ||
                                                    notebook.notebookName ||
                                                    "";

                                                const isSelected =
                                                    selectedNotebook?.notebookId ===
                                                        notebookId ||
                                                    selectedNotebook?.id ===
                                                        notebookId;

                                                return (

                                                    <button
                                                        type="button"
                                                        key={notebookId}
                                                        className={`notebook-result-item ${
                                                            isSelected
                                                                ? "selected"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            handleSelectNotebook(
                                                                notebook
                                                            )
                                                        }
                                                    >

                                                        <span className="notebook-result-name">
                                                            {notebookName}
                                                        </span>

                                                        <span className="notebook-result-id">
                                                            {notebookId}
                                                        </span>

                                                    </button>
                                                );
                                            }
                                        )

                                    ) : (

                                        <div className="no-notebooks">
                                            No notebooks found
                                        </div>
                                    )}

                                </div>
                            )}

                    </div>

                    {selectedNotebook && (

                        <div className="selected-notebook">

                            <span className="selected-label">
                                Selected:
                            </span>

                            <span className="selected-name">
                                {
                                    selectedNotebook.name ||
                                    selectedNotebook.notebookName
                                }
                            </span>

                            <button
                                type="button"
                                className="selected-notebook-remove"
                                onClick={handleClearNotebook}
                                disabled={loading}
                            >
                                ×
                            </button>

                        </div>
                    )}

                    <span className="create-page-helper">
                        Notebook selection is optional.
                    </span>

                    {errors.notebook && (
                        <span className="create-page-error">
                            {errors.notebook}
                        </span>
                    )}

                </div>

            </div>

            <div className="create-page-popup-buttons">

                <button
                    type="button"
                    className="create-page-reset-btn"
                    onClick={handleReset}
                    disabled={loading}
                >
                    Reset
                </button>

                <button
                    type="button"
                    className="create-page-cancel-btn"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="create-page-create-btn"
                    onClick={handleCreate}
                    disabled={
                        loading ||
                        !pageTitle.trim()
                    }
                >
                    {loading
                        ? "Creating..."
                        : "Create"}
                </button>

            </div>

        </div>
    );
}