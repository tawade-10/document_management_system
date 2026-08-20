import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const logButtonEvent = ({
        buttonNo,
        buttonName,
        request,
        response,
        status
    }) => {

        console.group(
            `${buttonNo} - ${buttonName}`
        );

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
        setLoading(true);

        const request = {
            method: "POST",
            url:
                `http://localhost:8080/api/auth/forgot-password?email=${email}`
        };

        try {

            const response = await axios.post(
                request.url
            );

            logButtonEvent({

                buttonNo: "BB8",

                buttonName:
                    "Send Link Button",

                request,

                response:
                    response.data,

                status:
                    response.status

            });

            setMsg(
                "Reset password link has been sent to your email."
            );

        } catch (error) {

            logButtonEvent({

                buttonNo: "BB8",

                buttonName:
                    "Send Link Button",

                request,

                response:
                    error.response?.data ||
                    error.message,

                status:
                    error.response?.status ||
                    500

            });

            setMsg(
                "Email not found!"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="fp-container">

            <div className="fp-card">

                <button
                    className="fp-back-btn"
                    onClick={() => {

                        logButtonEvent({

                            buttonNo: "BB7",

                            buttonName:
                                "Back Button",

                            request: {
                                action: "Navigate",
                                from: "/forgot-password",
                                to: "/"
                            },

                            response: {
                                message:
                                    "Navigating to Login Page"
                            },

                            status: 200

                        });

                        navigate("/");

                    }}
                >
                    <IoArrowBack size={22} />
                </button>

                <h2 className="fp-title">
                    Forgot Password?
                </h2>

                <form
                    className="fp-form"
                    onSubmit={handleSubmit}
                >

                    <label className="fp-label">
                        Email Address
                    </label>

                    <input
                        type="email"
                        className="fp-input"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <button
                        type="submit"
                        className="fp-submit"
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Sending..."
                                : "Send Link"
                        }
                    </button>

                </form>

                {msg && (
                    <p className="fp-message">
                        {msg}
                    </p>
                )}

            </div>

        </div>
    );
}