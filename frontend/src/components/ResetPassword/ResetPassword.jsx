import React, { useState } from "react";
import axios from "axios";
import "./ResetPassword.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMsg("");

        if (password !== confirmPassword) {
            setMsg("Passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            await axios.post(`http://localhost:8080/api/auth/reset-password?token=${token}&newPassword=${password}`);
            setMsg("Password reset successful!");
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error) {
            setMsg("Invalid or expired token!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rp-container">
            <div className="rp-card">
                <h2 className="rp-title">
                    Reset Password
                </h2>
                <form
                    className="rp-form"
                    onSubmit={handleSubmit}
                >
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
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword
                                ? <FaEyeSlash />
                                : <FaEye />
                            }
                        </span>
                    </div>
                    <label className="rp-label">
                        Confirm Password
                    </label>
                    <div className="rp-password-field">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
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
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        >
                            {showConfirmPassword
                                ? <FaEyeSlash />
                                : <FaEye />
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
                            : "Reset Password"}
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