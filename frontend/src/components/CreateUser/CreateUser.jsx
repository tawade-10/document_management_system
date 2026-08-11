import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./CreateUser.css";

const API_URL = "http://localhost:8080/api/auth";

export default function CreateUser() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        authorityId: ""
    });

    const [errors, setErrors] = useState({});


    /* =========================
       HANDLE CHANGE
    ========================= */

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


    /* =========================
       VALIDATION
    ========================= */

    const validate = () => {

        const temp = {};

        if (!formData.userName.trim()) {

            temp.userName =
                "User Name is required";

        }

        if (!formData.email.trim()) {

            temp.email =
                "Email is required";

        }
        else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                .test(formData.email)
        ) {

            temp.email =
                "Invalid Email Address";

        }

        if (!formData.authorityId) {

            temp.authorityId =
                "Please select Authority";

        }

        setErrors(temp);

        return Object.keys(temp).length === 0;

    };


    /* =========================
       RESET
    ========================= */

    const handleReset = () => {

        setFormData({
            userName: "",
            email: "",
            authorityId: ""
        });

        setErrors({});

    };


    /* =========================
       SUBMIT
    ========================= */

    const handleSubmit = async () => {

        if (!validate()) {
            return;
        }

        const token =
            localStorage.getItem("token");

        const payload = {
            userName: formData.userName,
            email: formData.email,
            authorityId: formData.authorityId
        };


        try {

            console.group(
                "BB17 - Create User"
            );

            console.log("Request");

            console.log({
                method: "POST",
                url: `${API_URL}/register`,
                payload
            });


            const response = await axios.post(
                `${API_URL}/register`,
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

            console.groupEnd();


            toast.success(
                "User created successfully.\nTemporary password has been sent to the user's email."
            );


            handleReset();


            navigate("/admin", {
                state: {
                    refresh: true
                }
            });

        }
        catch (error) {

            console.group(
                "BB17 - Create User"
            );

            console.log(
                error.response?.data
            );

            console.groupEnd();


            toast.error(
                error.response?.data?.message ||
                "Unable to Create User"
            );

        }

    };


    return (

        <div className="add-user-container">

            <div className="add-user-card">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="form-header">

                    <h2>
                        Create User
                    </h2>

                    <p>
                        Create a new user account
                        and assign an authority profile.
                    </p>

                </div>


                {/* =========================
                    AUTHORITY PROFILE
                ========================= */}

                <div className="form-group">

                    <label>
                        Authority Profile
                    </label>

                    <div className="input-wrapper">

                        <select
                            name="authorityId"
                            value={formData.authorityId}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select Authority Profile
                            </option>

                            <option value="0001">
                                0001 - ADMIN,SUPER_USER,USER
                            </option>

                            <option value="0002">
                                0002 - SUPER_USER,USER
                            </option>

                            <option value="0003">
                                0003 - ADMIN
                            </option>

                            <option value="0004">
                                0004 - ADMIN,USER
                            </option>

                            <option value="0005">
                                0005 - USER
                            </option>

                        </select>

                    </div>

                </div>

                <span className="error">
                    {errors.authorityId}
                </span>


                {/* =========================
                    USER NAME
                ========================= */}

                <div className="form-group">

                    <label>
                        User Name
                    </label>

                    <div className="input-wrapper">

                        <FaUser
                            className="field-icon"
                        />

                        <input
                            type="text"
                            name="userName"
                            placeholder="Enter User Name"
                            value={formData.userName}
                            onChange={handleChange}
                        />

                    </div>

                </div>

                <span className="error">
                    {errors.userName}
                </span>


                {/* =========================
                    EMAIL
                ========================= */}

                <div className="form-group">

                    <label>
                        Email
                    </label>

                    <div className="input-wrapper">

                        <MdEmail
                            className="field-icon"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                    </div>

                </div>

                <span className="error">
                    {errors.email}
                </span>


                {/* =========================
                    INFORMATION NOTE
                ========================= */}

                <div className="note-box">

                    <div className="note-title">
                        Note
                    </div>

                    <div className="note-text">

                        A secure temporary password
                        will be generated automatically
                        and sent to the user's registered
                        email along with a password reset
                        link.

                    </div>

                </div>


                {/* =========================
                    BUTTONS
                ========================= */}

                <div className="button-group">

                    <button
                        type="button"
                        className="reset-btn"
                        onClick={handleReset}
                    >
                        Reset
                    </button>

                    <button
                        type="button"
                        className="submit-btn"
                        onClick={handleSubmit}
                    >
                        Create User
                    </button>

                </div>

            </div>

        </div>

    );

}
