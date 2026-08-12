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


    /* =========================
       VALIDATION
    ========================= */

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


    /* =========================
       CREATE NOTEBOOK
    ========================= */

    const handleCreate = async () => {

        if (!validate()) {
            return;
        }


        const token =
            localStorage.getItem("token");


        const payload = {

            name:
                notebookName.trim(),

            description:
                description.trim()
        };


        try {

            setLoading(true);


            console.group(
                "NB1 - Create Notebook"
            );


            console.log("Request");

            console.log({

                method: "POST",

                url: API_URL,

                payload
            });


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

            console.log(
                response.data
            );


            console.log("Status Code");

            console.log(
                response.status
            );


            console.groupEnd();


            toast.success(
                "Notebook created successfully."
            );


            /*
             * Notify Header / parent if required
             */

            if (onCreate) {

                onCreate(
                    response.data
                );
            }


            /*
             * Close popup
             */

            onClose();


            /*
             * Refresh notebook list
             */

            navigate(
                "/user-homepage/view-all-notebooks-pages",
                {
                    state: {
                        refresh: true
                    }
                }
            );


        } catch (error) {

            console.group(
                "NB1 - Create Notebook"
            );


            console.log("Request");

            console.log(payload);


            console.log("Response");

            console.log(
                error.response?.data
            );


            console.log("Status Code");

            console.log(
                error.response?.status
            );


            console.groupEnd();


            toast.error(

                error.response?.data?.message ||

                error.response?.data ||

                "Unable to create notebook."
            );


        } finally {

            setLoading(false);
        }
    };


    /* =========================
       RESET
    ========================= */

    const handleReset = () => {

        setNotebookName("");

        setDescription("");

        setErrors({});
    };


    return (

        <div className="create-notebook-popup">

            {/* =========================
                TITLE
            ========================= */}

            <div className="create-notebook-popup-title">

                Create Notebook

            </div>


            {/* =========================
                BODY
            ========================= */}

            <div className="create-notebook-popup-body">


                {/* Notebook Name */}

                <div className="create-notebook-field">

                    <label>
                        Notebook Name
                    </label>

                    <input
                        type="text"

                        placeholder={
                            "Enter notebook name"
                        }

                        value={
                            notebookName
                        }

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


                {/* Description */}

                <div className="create-notebook-field">

                    <label>
                        Description
                    </label>

                    <textarea

                        placeholder={
                            "Enter notebook description"
                        }

                        value={
                            description
                        }

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
                    onClick={
                        handleReset
                    }
                    disabled={loading}
                >
                    Reset
                </button>
                <button
                    type="button"
                    className="create-notebook-cancel-btn"
                    onClick={
                        onClose
                    }
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="create-notebook-create-btn"
                    onClick={
                        handleCreate
                    }
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