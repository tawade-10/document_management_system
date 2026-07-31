import React, { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { toast } from "react-toastify";

export default function Header() {

    const API_URL = "http://localhost:8080/api/auth";

    const navigate = useNavigate();
    const location = useLocation();

    const [, forceUpdate] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const refresh = () => forceUpdate(prev => prev + 1);
        window.addEventListener("login", refresh);
        return () => window.removeEventListener("login", refresh);
    }, []);

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");

    const hideHeaderRoutes = [
        "/",
        "/forgot-password",
        "/reset-password"
    ];

    if (hideHeaderRoutes.includes(location.pathname)) {
        return null;
    }

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (!userId || !token) return;
        axios
            .get(`http://localhost:8080/api/notifications/recent-five/${userId}`)
            .then((res) => {
                const recent = (res.data || []).slice(0, 5);
                setNotifications(recent);
                setUnreadCount(
                    recent.filter(n => !n.read).length
                );
            })
            .catch(console.error);
    }, [userId, token]);

    useEffect(() => {
        if (!userId || !token) return;
        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/notifications/${userId}`, (msg) => {
                    const notification = JSON.parse(msg.body);
                    setNotifications(prev =>
                        [notification, ...prev].slice(0, 5)
                    );
                    setUnreadCount(prev => prev + 1);
                });
            }
        });
        client.activate();
        return () => client.deactivate();
    }, [userId, token]);

    const handleLogout = async () => {
        try {
            await axios.post(
                `${API_URL}/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success("Logged out successfully.");
        } catch {
            toast.error("Logout failed.");
        } finally {
            localStorage.clear();
            window.dispatchEvent(new Event("login"));
            navigate("/");
        }
    };

    return (
        <header className="header">
            <div className="header-left">
                <div className="logo" onClick={() => navigate("/homepage")}>
                    MOM Portal
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search Users, Notebooks, Pages..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <FaSearch className="search-icon" />
                </div>
            </div>
            <div className="header-right">
                <div className="notification-wrapper" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <IoNotificationsOutline
                        size={24}
                        className="notification-icon"
                    />
                    {unreadCount > 0 &&
                        <span className="notification-badge">
                            {unreadCount}
                        </span>
                    }
                    {dropdownOpen && (
                        <div className="notification-dropdown">
                            <h4>Notifications</h4>
                            {notifications.length === 0 ? (
                                <p>No notifications available.</p>
                            ) : (
                                notifications.map(notification => (
                                    <div
                                        key={notification.notificationId}
                                        className="notification-card"
                                    >
                                        <p>{notification.message}</p>
                                        <small>
                                            {notification.updatedAt
                                                ? new Date(notification.updatedAt).toLocaleString()
                                                : ""}
                                        </small>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
                <span className="welcome-user">
                    Welcome,&nbsp;
                    <b>{username}</b>
                </span>
                <CgProfile
                    size={30}
                    className="profile-icon"
                />
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </header>
    );
}