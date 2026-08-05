import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ViewUser.css";

export default function ViewUser() {

    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const logButtonEvent = ({buttonNo, buttonName, request, response, status}) => {
        console.group(`${buttonNo} - ${buttonName}`);
        console.log("Request");
        console.log(request);
        console.log("Response");
        console.log(response);
        console.log("Status Code");
        console.log(status);
        console.groupEnd();
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {

        const request = {
            method: "GET",
            url: `http://localhost:8080/api/users/${userId}`
        };

        try {
            const response = await axios.get(
                request.url,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            logButtonEvent({
                buttonNo: "BB16",
                buttonName: "User Row Click",
                request,
                response: response.data,
                status: response.status
            });
            setUser(response.data);
        } catch (error) {
            logButtonEvent({
                buttonNo: "BB16",
                buttonName: "User Row Click",
                request,
                response: error.response?.data || error.message,
                status: error.response?.status || 500
            });
            toast.error("Unable to load user.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async () => {
        const buttonNo = user.status === "UAC" ? "BB20" : "BB19";
        const buttonName = user.status === "UAC" ? "Deactivate User Button" : "Activate User Button";
        const request = {
            method: "PUT",
            url: `http://localhost:8080/api/users/updateStatus/${user.userId}`
        };

        try {
            const response = await axios.put(
                request.url,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            logButtonEvent({
                buttonNo,
                buttonName,
                request,
                response: response.data,
                status: response.status
            });
            toast.success(response.data.message);
            fetchUser();
        } catch (error) {
            logButtonEvent({
                buttonNo,
                buttonName,
                request,
                response: error.response?.data || error.message,
                status: error.response?.status || 500
            });
            toast.error(error.response?.data?.message || "Unable to update user.");
        }
    };

    if (loading) {
        return <h3 className="loading">Loading User...</h3>;
    }

    return (
        <div className="view-user-container">
            <div className="view-user-card">
                <h2>View User</h2>
                <div className="form-group">
                    <label>User ID</label>
                    <input
                        value={user.userId}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>User Name</label>
                    <input
                        value={user.userName}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        value={user.email}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>Authority</label>
                    <input
                        value={user.authorityName}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>Status</label>
                    <input
                        value={
                            user.status === "UAC"
                                ? "Active"
                                : "Inactive"
                        }
                        readOnly
                    />
                </div>
                <div className="button-group">
                    <button
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                    <button
                        className={
                            user.status === "UAC"
                                ? "deactivate-btn"
                                : "activate-btn"
                        }
                        onClick={handleStatus}
                    >
                        {
                            user.status === "UAC"
                                ? "Deactivate User"
                                : "Activate User"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}