import React, { useState } from "react";
import axios from "axios";
import "./ResetPassword.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // First Login Fields
    const [email, setEmail] = useState("");
    const [temporaryPassword, setTemporaryPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showTemporaryPassword, setShowTemporaryPassword] = useState(false);

    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const isForgotPassword = token !== null;

    const navigate = useNavigate();

    const logButtonEvent = ({
        buttonNo,
        buttonName,
        request,
        response,
        status
    }) => {
        console.group(`${buttonNo} - ${buttonName}`);
        console.log("Request");
        console.log(request);
        console.log("Response");
        console.log(response);
        console.log("Status Code");
        console.log(status);
        console.groupEnd();
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setMsg("");

        if (password !== confirmPassword) {

            logButtonEvent({
                buttonNo: "BB12",
                buttonName: "Reset Password Button",
                request: {
                    email,
                    temporaryPassword,
                    password,
                    confirmPassword
                },
                response: {
                    message: "Passwords do not match"
                },
                status: 400
            });

            setMsg("Passwords do not match!");
            return;
        }

        setLoading(true);

        let request = {};

        if (isForgotPassword) {

            request = {
                method: "POST",
                url:
                    `http://localhost:8080/api/auth/reset-password` +
                    `?token=${token}` +
                    `&newPassword=${password}`
            };

        } else {

            request = {
                method: "POST",
                url: "http://localhost:8080/api/auth/create-password",
                data: {
                    temporaryPassword,
                    newPassword: password
                }
            };

        try {

            const response = isForgotPassword
                ? await axios.post(request.url)
                : await axios.post(request.url, request.data);

            logButtonEvent({
                buttonNo: "BB12",
                buttonName: isForgotPassword
                    ? "Reset Password Button"
                    : "Create Password Button",
                request,
                response: response.data,
                status: response.status
            });

            setMsg(
                isForgotPassword
                    ? "Password reset successful!"
                    : "Password created successfully!"
            );

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {

            logButtonEvent({
                buttonNo: "BB12",
                buttonName: isForgotPassword
                    ? "Reset Password Button"
                    : "Create Password Button",
                request,
                response:
                    error.response?.data ||
                    error.message,
                status:
                    error.response?.status ||
                    500
            });

            setMsg(
                error.response?.data ||
                "Unable to update password."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="rp-container">
            <div className="rp-card">

                <h2 className="rp-title">
                    {isForgotPassword
                        ? "Reset Password"
                        : "Create Password"}
                </h2>

                <form
                    className="rp-form"
                    onSubmit={handleSubmit}
                >

                    {/* First Login Only */}
                    {!isForgotPassword && (
                        <>
                            <label className="rp-label">
                                Email
                            </label>

                            <input
                                type="email"
                                className="rp-input"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                            <label className="rp-label">
                                Temporary Password
                            </label>

                            <div className="rp-password-field">

                                <input
                                    type={
                                        showTemporaryPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="rp-input"
                                    placeholder="Enter Temporary Password"
                                    value={temporaryPassword}
                                    onChange={(e) =>
                                        setTemporaryPassword(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                                <span
                                    className="rp-password-icon"
                                    onClick={() =>
                                        setShowTemporaryPassword(
                                            !showTemporaryPassword
                                        )
                                    }
                                >
                                    {showTemporaryPassword
                                        ? <FaEyeSlash/>
                                        : <FaEye/>
                                    }
                                </span>

                            </div>
                        </>
                    )}
                                    <label className="rp-label">
                                        New Password
                                    </label>

                                    <div className="rp-password-field">

                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="rp-input"
                                            placeholder="Enter New Password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                        />

                                        <span
                                            className="rp-password-icon"
                                            onClick={() => {

                                                const buttonNo =
                                                    showPassword
                                                        ? "BB9"
                                                        : "BB8";

                                                const buttonName =
                                                    showPassword
                                                        ? "Hide New Password Button (Eye Icon)"
                                                        : "Show New Password Button (Eye Icon)";

                                                logButtonEvent({
                                                    buttonNo,
                                                    buttonName,
                                                    request: {
                                                        action: showPassword
                                                            ? "Hide Password"
                                                            : "Show Password"
                                                    },
                                                    response: {
                                                        message: showPassword
                                                            ? "Password Hidden"
                                                            : "Password Visible"
                                                    },
                                                    status: 200
                                                });

                                                setShowPassword(!showPassword);

                                            }}
                                        >
                                            {showPassword
                                                ? <FaEyeSlash/>
                                                : <FaEye/>
                                            }
                                        </span>

                                    </div>

                                    <label className="rp-label">
                                        Confirm Password
                                    </label>

                                    <div className="rp-password-field">

                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="rp-input"
                                            placeholder="Confirm Password"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(e.target.value)
                                            }
                                            required
                                        />

                                        <span
                                            className="rp-password-icon"
                                            onClick={() => {

                                                const buttonNo =
                                                    showConfirmPassword
                                                        ? "BB11"
                                                        : "BB10";

                                                const buttonName =
                                                    showConfirmPassword
                                                        ? "Hide Confirm Password Button (Eye Icon)"
                                                        : "Show Confirm Password Button (Eye Icon)";

                                                logButtonEvent({
                                                    buttonNo,
                                                    buttonName,
                                                    request: {
                                                        action: showConfirmPassword
                                                            ? "Hide Password"
                                                            : "Show Password"
                                                    },
                                                    response: {
                                                        message: showConfirmPassword
                                                            ? "Password Hidden"
                                                            : "Password Visible"
                                                    },
                                                    status: 200
                                                });

                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                );

                                            }}
                                        >
                                            {showConfirmPassword
                                                ? <FaEyeSlash/>
                                                : <FaEye/>
                                            }
                                        </span>

                                    </div>

                                    <button
                                        type="submit"
                                        className="rp-submit"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Updating..."
                                            : isForgotPassword
                                                ? "Reset Password"
                                                : "Create Password"}
                                    </button>
                                </form>
                                {msg && (
                                    <p
                                        className={`rp-message ${
                                            msg.toLowerCase().includes("successful")
                                                ? "success"
                                                : "error"
                                        }`}
                                    >
                                        {msg}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                }
            }