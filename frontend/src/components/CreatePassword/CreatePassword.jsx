import React, { useState } from "react";
import axios from "axios";
import {
    FaLock,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";
import {
    useNavigate,
    useSearchParams
} from "react-router-dom";
import { toast } from "react-toastify";
import "./CreatePassword.css";

const API_URL = "http://localhost:8080/api/auth";

export default function CreatePassword() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    // Password creation token received from email link
    // Example:
    // /create-password?token=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const token = searchParams.get("token");

    const [showTempPassword, setShowTempPassword] =
        useState(false);

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [formData, setFormData] = useState({
        temporaryPassword: "",
        password: "",
        confirmPassword: ""
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

        if (!formData.temporaryPassword.trim()) {

            temp.temporaryPassword =
                "Temporary Password is required";

        }

        if (!formData.password.trim()) {

            temp.password =
                "New Password is required";

        }
        else if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&!]).{8,20}$/
                .test(formData.password)
        ) {

            temp.password =
                "Password must contain uppercase, lowercase, number and special character.";

        }

        if (!formData.confirmPassword.trim()) {

            temp.confirmPassword =
                "Confirm Password is required";

        }
        else if (
            formData.password !==
            formData.confirmPassword
        ) {

            temp.confirmPassword =
                "Passwords do not match";

        }

        setErrors(temp);

        return Object.keys(temp).length === 0;

    };


    /* =========================
       RESET
    ========================= */

    const handleReset = () => {

        setFormData({
            temporaryPassword: "",
            password: "",
            confirmPassword: ""
        });

        setErrors({});

        setShowTempPassword(false);
        setShowPassword(false);
        setShowConfirmPassword(false);

    };


    /* =========================
       SUBMIT
    ========================= */

    const handleSubmit = async () => {

        /*
         * The password creation token comes from
         * the email URL.
         *
         * We DO NOT use localStorage JWT here.
         */

        if (!token) {

            toast.error(
                "Invalid or missing password creation link."
            );

            return;
        }

        if (!validate()) {
            return;
        }

        const payload = {

            temporaryPassword:
                formData.temporaryPassword,

            newPassword:
                formData.password

        };

        try {

            console.group(
                "BB22 - Create Password"
            );

            console.log("Request");

            console.log({
                method: "POST",
                url:
                    `${API_URL}/create-password?token=${token}`,
                payload
            });

            const response = await axios.post(

                `${API_URL}/create-password?token=${encodeURIComponent(token)}`,

                payload,

                {
                    headers: {
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

            toast.success(
                response.data ||
                "Password created successfully."
            );

            handleReset();

            /*
             * Give toast a moment to display
             * before navigating to login.
             */

            setTimeout(() => {

                navigate("/");

            }, 1000);

        }
        catch (error) {

            console.group(
                "BB22 - Create Password"
            );

            console.log("Request");

            console.log({
                method: "POST",
                url:
                    `${API_URL}/create-password?token=${token}`,
                payload
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

            let errorMessage =
                "Unable to create password.";

            if (
                typeof error.response?.data ===
                "string"
            ) {

                errorMessage =
                    error.response.data;

            }
            else if (
                error.response?.data?.message
            ) {

                errorMessage =
                    error.response.data.message;

            }

            toast.error(errorMessage);

        }

    };


    return (

        <div className="create-password-container">

            <div className="create-password-card">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="password-form-header">

                    <h2>
                        Create New Password
                    </h2>

                    <p>
                        Enter your temporary password
                        and create a new password.
                    </p>

                </div>


                {/* =========================
                    TEMPORARY PASSWORD
                ========================= */}

                <div className="password-form-group">

                    <label>
                        Temporary Password
                    </label>

                    <div className="password-input-wrapper">

                        <FaLock
                            className="password-field-icon"
                        />

                        <input
                            type={
                                showTempPassword
                                    ? "text"
                                    : "password"
                            }
                            name="temporaryPassword"
                            placeholder="Enter Temporary Password"
                            value={
                                formData.temporaryPassword
                            }
                            onChange={handleChange}
                        />

                        <span
                            className="password-eye-icon"
                            onClick={() =>
                                setShowTempPassword(
                                    prev => !prev
                                )
                            }
                        >

                            {
                                showTempPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                            }

                        </span>

                    </div>

                </div>

                <span className="password-error">
                    {errors.temporaryPassword}
                </span>


                {/* =========================
                    NEW PASSWORD
                ========================= */}

                <div className="password-form-group">

                    <label>
                        New Password
                    </label>

                    <div className="password-input-wrapper">

                        <FaLock
                            className="password-field-icon"
                        />

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            name="password"
                            placeholder="Enter New Password"
                            value={
                                formData.password
                            }
                            onChange={handleChange}
                        />

                        <span
                            className="password-eye-icon"
                            onClick={() =>
                                setShowPassword(
                                    prev => !prev
                                )
                            }
                        >

                            {
                                showPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                            }

                        </span>

                    </div>

                </div>

                <span className="password-error">
                    {errors.password}
                </span>


                {/* =========================
                    CONFIRM PASSWORD
                ========================= */}

                <div className="password-form-group">

                    <label>
                        Confirm New Password
                    </label>

                    <div className="password-input-wrapper">

                        <FaLock
                            className="password-field-icon"
                        />

                        <input
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            value={
                                formData.confirmPassword
                            }
                            onChange={handleChange}
                        />

                        <span
                            className="password-eye-icon"
                            onClick={() =>
                                setShowConfirmPassword(
                                    prev => !prev
                                )
                            }
                        >

                            {
                                showConfirmPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                            }

                        </span>

                    </div>

                </div>

                <span className="password-error">
                    {errors.confirmPassword}
                </span>


                {/* =========================
                    PASSWORD REQUIREMENTS
                ========================= */}

                <div className="password-note">

                    <div className="password-note-title">
                        Password Requirements
                    </div>

                    <ul>

                        <li>
                            8 - 20 characters
                        </li>

                        <li>
                            At least one uppercase letter
                        </li>

                        <li>
                            At least one lowercase letter
                        </li>

                        <li>
                            At least one number
                        </li>

                        <li>
                            At least one special character
                            (@ # $ % & !)
                        </li>

                    </ul>

                </div>


                {/* =========================
                    BUTTONS
                ========================= */}

                <div className="password-button-group">

                    <button
                        type="button"
                        className="password-reset-btn"
                        onClick={handleReset}
                    >
                        Reset
                    </button>

                    <button
                        type="button"
                        className="password-submit-btn"
                        onClick={handleSubmit}
                    >
                        Create Password
                    </button>

                </div>


                {/* =========================
                    BACK TO LOGIN
                ========================= */}

                <button
                    type="button"
                    className="back-login-btn"
                    onClick={() => navigate("/")}
                >
                    Back to Login
                </button>

            </div>

        </div>

    );

}