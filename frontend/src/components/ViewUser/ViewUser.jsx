import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaLock, FaEdit } from "react-icons/fa";
import "./ViewUser.css";

const API_URL = "http://localhost:8080/api/users";

export default function ViewUser() {

    const { userId } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {

        fetchUser();

    }, [userId]);

    const fetchUser = async () => {

        if (!token) {

            navigate("/");

            return;
        }

        if (!userId) {

            toast.error("User ID is missing.");

            navigate("/admin");

            return;
        }

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/${userId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            console.log(
                "GET USER RESPONSE:",
                response.data
            );

            setUser(response.data);

        } catch (error) {

            console.error(
                "GET USER ERROR:",
                error.response?.data ||
                error.message
            );

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
                    "You are not authorized to view users."
                );

                navigate("/admin");

            } else if (
                error.response?.status === 404
            ) {

                toast.error(
                    "User not found."
                );

                navigate("/admin");

            } else {

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load user."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    const handleUpdate = async () => {

        if (saving) {
            return;
        }

        if (!token) {

            toast.error(
                "Session expired. Please login again."
            );

            navigate("/");

            return;
        }

        if (!userId) {

            toast.error(
                "User ID is missing."
            );

            return;
        }

        if (!user) {

            toast.error(
                "User information is not available."
            );

            return;
        }

        const trimmedUserName =
            String(
                user.userName || ""
            ).trim();

        const trimmedEmail =
            String(
                user.email || ""
            ).trim();

        if (!trimmedUserName) {

            toast.error(
                "User name cannot be empty."
            );

            return;
        }

        if (!trimmedEmail) {

            toast.error(
                "Email cannot be empty."
            );

            return;
        }

        const requestData = {
            userName: trimmedUserName,
            email: trimmedEmail
        };

        const request = {
            method: "PUT",
            url: `${API_URL}/update/${userId}`,
            data: requestData
        };

        console.group(
            "UPDATE USER"
        );

        console.log(
            "User ID:",
            userId
        );

        console.log(
            "Request:",
            request
        );

        try {

            setSaving(true);

            const response = await axios.put(
                `${API_URL}/update/${userId}`,
                requestData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );

            console.log(
                "Response:",
                response.data
            );

            console.log(
                "Status Code:",
                response.status
            );

            console.groupEnd();
            setUser(response.data);

            toast.success(
                "User updated successfully."
            );
            navigate("/admin");

        } catch (error) {

            console.error(
                "UPDATE USER ERROR:",
                error.response?.data ||
                error.message
            );

            console.error(
                "STATUS:",
                error.response?.status
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
                    "You are not authorized to update this user."
                );

            } else if (
                error.response?.status === 404
            ) {

                toast.error(
                    "User not found."
                );

            } else {

                toast.error(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Unable to update user."
                );
            }

        } finally {

            setSaving(false);
        }
    };

    const getStatusLabel = () => {
        const status =
            typeof user.status === "string"
                ? user.status
                : user.status?.statusId ||
                  user.status?.id ||
                  "";

        return status === "UAC"
            ? "Active"
            : "Inactive";
    };

    if (loading) {

        return (
            <div className="view-user-page">

                <div className="view-user-loading">
                    Loading...
                </div>

            </div>
        );
    }

    if (!user) {

        return (
            <div className="view-user-page">

                <div className="view-user-loading">
                    User not found.
                </div>

            </div>
        );
    }

    return (

        <div className="view-user-page">

            <div className="view-user-card">

                <div className="view-user-header">

                    <h2>
                        View / Edit User
                    </h2>

                    <p>
                        View user details and update editable information
                    </p>

                </div>

                <div className="view-user-form">

                    <div className="view-user-form-group">

                        <label>
                            User ID
                        </label>

                        <div className="view-user-input-wrapper readonly">

                            <input
                                value={
                                    user.userId || ""
                                }
                                readOnly
                            />

                            <FaLock className="view-user-field-icon" />

                        </div>

                    </div>

                    <div className="view-user-form-group">

                        <label>
                            Authority Profile
                        </label>

                        <div className="view-user-input-wrapper readonly">

                            <input
                                value={
                                    user.authorityName || ""
                                }
                                readOnly
                            />

                            <FaLock className="view-user-field-icon" />

                        </div>

                    </div>

                    <div className="view-user-form-group">

                        <label>
                            User Name
                        </label>

                        <div className="view-user-input-wrapper editable">

                            <input
                                type="text"
                                value={
                                    user.userName || ""
                                }
                                onChange={(event) => {

                                    setUser(prev => ({
                                        ...prev,
                                        userName:
                                            event.target.value
                                    }));

                                }}
                                disabled={saving}
                            />

                            <FaEdit className="view-user-field-icon" />

                        </div>

                    </div>

                    {/* EMAIL */}

                    <div className="view-user-form-group">

                        <label>
                            Email
                        </label>

                        <div className="view-user-input-wrapper editable">

                            <input
                                type="email"
                                value={
                                    user.email || ""
                                }
                                onChange={(event) => {

                                    setUser(prev => ({
                                        ...prev,
                                        email:
                                            event.target.value
                                    }));

                                }}
                                disabled={saving}
                            />

                            <FaEdit className="view-user-field-icon" />

                        </div>

                    </div>

                    {/* STATUS */}

                    <div className="view-user-form-group">

                        <label>
                            Status
                        </label>

                        <div className="view-user-input-wrapper readonly">

                            <input
                                value={
                                    getStatusLabel()
                                }
                                readOnly
                            />

                            <FaLock className="view-user-field-icon" />

                        </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="view-user-actions">

                        <button
                            type="button"
                            className="view-user-save-btn"
                            onClick={handleUpdate}
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : "Save Changes"}

                        </button>

                        <button
                            type="button"
                            className="view-user-cancel-btn"
                            onClick={() =>
                                navigate("/admin")
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}