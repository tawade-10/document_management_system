import React, { useState } from "react";
import axios from "axios";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./CreatePassword.css";

const API_URL = "http://localhost:8080/api/auth";

export default function CreatePassword() {

    const navigate = useNavigate();

    const [showTempPassword, setShowTempPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        temporaryPassword: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: ""
        });
    };

    const validate = () => {

        let temp = {};

        if (!formData.email.trim()) {
            temp.email = "Email is required";
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
        ) {
            temp.email = "Invalid Email Address";
        }

        if (!formData.temporaryPassword.trim()) {
            temp.temporaryPassword = "Temporary Password is required";
        }

        if (!formData.password.trim()) {

            temp.password = "New Password is required";

        } else if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&!]).{8,20}$/.test(
                formData.password
            )
        ) {

            temp.password =
                "Password must contain uppercase, lowercase, number and special character.";

        }

        if (!formData.confirmPassword.trim()) {

            temp.confirmPassword = "Confirm Password is required";

        } else if (formData.password !== formData.confirmPassword) {

            temp.confirmPassword = "Passwords do not match";

        }

        setErrors(temp);

        return Object.keys(temp).length === 0;
    };

    const handleSubmit = async () => {

        if (!validate()) return;

        const payload = {
            email: formData.email,
            temporaryPassword: formData.temporaryPassword,
            newPassword: formData.password
        };

        try {

            console.group("BB22 - Create Password");

            console.log("Request");
            console.log({
                method: "POST",
                url: `${API_URL}/create-password`,
                payload
            });

            const response = await axios.post(
                `${API_URL}/create-password`,
                payload
            );

            console.log("Response");
            console.log(response.data);

            console.groupEnd();

            toast.success(response.data);

            navigate("/");

        } catch (error) {

            console.group("BB22 - Create Password");

            console.log("Request");
            console.log(payload);

            console.log("Response");
            console.log(error.response?.data);

            console.groupEnd();

            toast.error(
                error.response?.data || "Unable to create password."
            );
        }
    };

    return (

        <div className="reset-container">

            <div className="reset-card">

                <h2>Create New Password</h2>

                <p className="reset-subtitle">
                    Enter your registered email, temporary password and create a new password.
                </p>

                <div className="input-box">

                    <MdEmail />

                    <input
                        type="email"
                        name="email"
                        placeholder="Registered Email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                </div>

                <span className="error">
                    {errors.email}
                </span>

                <div className="input-box">

                    <FaLock />

                    <input
                        type={showTempPassword ? "text" : "password"}
                        name="temporaryPassword"
                        placeholder="Temporary Password"
                        value={formData.temporaryPassword}
                        onChange={handleChange}
                    />

                    <span
                        className="eye-icon"
                        onClick={() =>
                            setShowTempPassword(!showTempPassword)
                        }
                    >
                        {showTempPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>

                </div>

                <span className="error">
                    {errors.temporaryPassword}
                </span>

                <div className="input-box">

                    <FaLock />

                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="New Password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <span
                        className="eye-icon"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>

                </div>

                <span className="error">
                    {errors.password}
                </span>

                <div className="input-box">

                    <FaLock />

                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />

                    <span
                        className="eye-icon"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>

                </div>

                <span className="error">
                    {errors.confirmPassword}
                </span>

                <div className="password-note">

                    <strong>Password Requirements</strong>

                    <ul>
                        <li>8 - 20 characters</li>
                        <li>At least one uppercase letter</li>
                        <li>At least one lowercase letter</li>
                        <li>At least one number</li>
                        <li>At least one special character (@ # $ % & !)</li>
                    </ul>

                </div>

                <button
                    className="reset-password-btn"
                    onClick={handleSubmit}
                >
                    Create Password
                </button>

                <button
                    className="back-login-btn"
                    onClick={() => navigate("/")}
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}