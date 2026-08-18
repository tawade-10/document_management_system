import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./CreateNotebookPopup.css";

const API_URL = "http://localhost:8080/api/notebooks/create";

export default function CreateNotebookPopup({
    onClose,
    onCreate
}) {

    const navigate = useNavigate();

    const [notebookName, setNotebookName] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {

        const temp = {};

        if (!notebookName.trim()) {

            temp.notebookName =
                "Notebook Name is required";

        } else if (
            notebookName.trim().length > 150
        ) {

            temp.notebookName =
                "Notebook Name cannot exceed 150 characters";
        }

        if (
            description.trim().length > 500
        ) {

            temp.description =
                "Description cannot exceed 500 characters";
        }

        setErrors(temp);

        return Object.keys(temp).length === 0;
    };

    const handleCreate = async () => {

        if (!validate()) {
            return;
        }

        const token =
            localStorage.getItem("token");

        if (!token) {

            toast.error(
                "Session expired. Please login again."
            );

            navigate("/");

            return;
        }

        const payload = {
            name: notebookName.trim(),
            description: description.trim()
        };

        const request = {
            method: "POST",
            url: API_URL,
            payload
        };

        try {

            setLoading(true);

            console.group(
                "NB1 - Create Notebook"
            );

            console.log("Request");
            console.log(request);

            const response =
                await axios.post(
                    API_URL,
                    payload,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            console.log("Response");
            console.log(response.data);

            console.log("Status Code");
            console.log(response.status);

            console.groupEnd();

            if (onCreate) {

                onCreate(
                    response.data
                );
            }

            window.dispatchEvent(
                new CustomEvent(
                    "notebookCreated",
                    {
                        detail: {
                            notebook:
                                response.data,

                            refreshKey:
                                Date.now()
                        }
                    }
                )
            );

            toast.success(
                "Notebook created successfully."
            );

            setNotebookName("");
            setDescription("");
            setErrors({});

            onClose();

            navigate(
                "/user-homepage",
                {
                    state: {
                        refresh: true,
                        refreshKey: Date.now(),
                        createdNotebook:
                            response.data
                    }
                }
            );

        } catch (error) {

            console.group(
                "NB1 - Create Notebook"
            );

            console.log("Request");
            console.log(request);

            console.log("Response");

            console.log(
                error.response?.data ||
                error.message
            );

            console.log("Status Code");

            console.log(
                error.response?.status ||
                500
            );

            console.groupEnd();

            if (
                error.response?.status === 401
            ) {

                toast.error(
                    "Session expired. Please login again."
                );

                localStorage.clear();

                navigate("/");

            } else if (
                error.response?.status === 403
            ) {

                toast.error(
                    "You are not authorized to create a notebook."
                );

            } else if (
                error.response?.status === 400
            ) {

                toast.error(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Invalid notebook details."
                );

            } else {

                toast.error(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Unable to create notebook."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    const handleReset = () => {

        setNotebookName("");
        setDescription("");
        setErrors({});
    };

    const handleClose = () => {

        if (loading) {
            return;
        }

        onClose();
    };

    return (

        <div className="create-notebook-popup">

            <div className="create-notebook-popup-title">
                Create Notebook
            </div>

            <div className="create-notebook-popup-body">

                <div className="create-notebook-field">

                    <label>
                        Notebook Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter notebook name"
                        value={notebookName}
                        onChange={e => {

                            setNotebookName(
                                e.target.value
                            );

                            setErrors(prev => ({
                                ...prev,
                                notebookName: ""
                            }));
                        }}
                        maxLength={150}
                        disabled={loading}
                    />

                    {errors.notebookName && (

                        <span className="create-notebook-error">
                            {errors.notebookName}
                        </span>

                    )}

                </div>

                <div className="create-notebook-field">

                    <label>
                        Description
                    </label>

                    <textarea
                        placeholder="Enter notebook description"
                        value={description}
                        onChange={e => {

                            setDescription(
                                e.target.value
                            );

                            setErrors(prev => ({
                                ...prev,
                                description: ""
                            }));
                        }}
                        maxLength={500}
                        rows={4}
                        disabled={loading}
                    />

                    {errors.description && (

                        <span className="create-notebook-error">
                            {errors.description}
                        </span>

                    )}

                </div>

            </div>

            <div className="create-notebook-popup-buttons">

                <button
                    type="button"
                    className="create-notebook-reset-btn"
                    onClick={handleReset}
                    disabled={loading}
                >
                    Reset
                </button>

                <button
                    type="button"
                    className="create-notebook-cancel-btn"
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="create-notebook-create-btn"
                    onClick={handleCreate}
                    disabled={
                        loading ||
                        !notebookName.trim()
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