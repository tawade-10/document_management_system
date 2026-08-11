import React, { useState } from "react";
import axios from "axios";
import { FaBook, FaAlignLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./CreateNotebook.css";

const API_URL = "http://localhost:8080/api/notebooks/create";

export default function CreateNotebook() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    };


    const validate = () => {

        const temp = {};

        if (!formData.name.trim()) {
            temp.name = "Notebook Name is required";
        }
        else if (formData.name.trim().length > 150) {
            temp.name = "Notebook Name cannot exceed 150 characters";
        }

        if (formData.description.trim().length > 500) {
            temp.description =
                "Description cannot exceed 500 characters";
        }

        setErrors(temp);

        return Object.keys(temp).length === 0;
    };


    const handleReset = () => {

        setFormData({
            name: "",
            description: ""
        });

        setErrors({});
    };


    const handleSubmit = async () => {

        if (!validate()) {
            return;
        }

        const token = localStorage.getItem("token");

        const payload = {
            name: formData.name.trim(),
            description: formData.description.trim()
        };

        try {

            console.group("NB1 - Create Notebook");

            console.log("Request");

            console.log({
                method: "POST",
                url: API_URL,
                payload
            });

            const response = await axios.post(
                API_URL,
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

            console.groupEnd();

            toast.success(
                "Notebook created successfully."
            );

            handleReset();

            navigate("/superuser-homepage", {
                state: {
                    refresh: true
                }
            });

        }
        catch (error) {

            console.group("NB1 - Create Notebook");

            console.log("Request");

            console.log(payload);

            console.log("Response");

            console.log(error.response?.data);

            console.groupEnd();

            toast.error(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to create notebook."
            );
        }
    };


    return (

        <div className="create-notebook-container">

            <div className="create-notebook-card">

                {/* Header */}

                <div className="notebook-form-header">

                    <h2>Create Notebook</h2>

                    <p>
                        Enter the details to create a new notebook.
                    </p>

                </div>


                {/* Notebook Name */}

                <div className="notebook-form-group">

                    <label>
                        Notebook Name
                    </label>

                    <div className="notebook-input-wrapper">

                        <FaBook className="notebook-field-icon" />

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Notebook Name"
                            value={formData.name}
                            onChange={handleChange}
                            maxLength={150}
                        />

                    </div>

                </div>

                <span className="notebook-error">
                    {errors.name}
                </span>


                {/* Description */}

                <div className="notebook-form-group description-group">

                    <label>
                        Description
                    </label>

                    <div className="notebook-input-wrapper textarea-wrapper">

                        <FaAlignLeft className="notebook-field-icon textarea-icon" />

                        <textarea
                            name="description"
                            placeholder="Enter Notebook Description"
                            value={formData.description}
                            onChange={handleChange}
                            maxLength={500}
                        />

                    </div>

                </div>

                <span className="notebook-error">
                    {errors.description}
                </span>


                {/* Note */}

                <div className="notebook-note">

                    <strong>Note:</strong>

                    <span>
                        The notebook will be created with an active
                        status and the logged-in user will be assigned
                        as the creator.
                    </span>

                </div>


                {/* Buttons */}

                <div className="notebook-button-group">

                    <button
                        type="button"
                        className="notebook-reset-btn"
                        onClick={handleReset}
                    >
                        Reset
                    </button>

                    <button
                        type="button"
                        className="notebook-submit-btn"
                        onClick={handleSubmit}
                    >
                        Create Notebook
                    </button>

                </div>

            </div>

        </div>
    );
}