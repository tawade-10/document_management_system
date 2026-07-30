import React, { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

export default function Header() {

  const API_URL = "http://localhost:8080/api/auth";

  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("userName");

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userId = localStorage.getItem("customerId");
  const isLoginPage = location.pathname === "/";

  useEffect(() => {
    const refresh = () => setToken(localStorage.getItem("token"));
    window.addEventListener("login", refresh);
    return () => window.removeEventListener("login", refresh);
  }, []);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8080/api/notifications/recent-five/${userId}`)
      .then((res) => {
        const recent = (res.data || []).slice(0, 5);
        setNotifications(recent);

        setUnreadCount(
          recent.filter((n) => !n.read).length
        );
      })
      .catch((err) => console.log(err));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS("http://localhost:8080/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        client.subscribe(`/topic/notifications/${userId}`, (msg) => {
          const notif = JSON.parse(msg.body);

          setNotifications((prev) => {
            const exists = prev.some(
              (n) => n.notificationId === notif.notificationId
            );

            if (exists) {
              return prev.map((n) =>
                n.notificationId === notif.notificationId ? notif : n
              ).slice(0, 5);
            }

            return [notif, ...prev].slice(0, 5);
          });

          setUnreadCount((prev) => prev + 1);
        });
      }
    });

    client.activate();
    return () => client.deactivate();
  }, [userId]);

const handleLogout = async () => {
    try {
        const token = localStorage.getItem("token");
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
    } catch (error) {
        console.error("Logout Error:", error);
        toast.error("Logout failed.");
    } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("email");
        localStorage.removeItem("authority");
        navigate("/");
    }
};

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    if (!dropdownOpen) setUnreadCount(0);
  };

return (
  <div className="header-bar">
{/*     <div className="logo">Bank Name</div> */}

    {!isLoginPage && token && (
      <div className="right-section">

        <span className="welcome-text">
          Welcome, <b>{username || "User"}</b>
        </span>

        <div className="notif-wrapper" onClick={toggleDropdown}>
          <IoNotificationsOutline size={24} className="notif-icon" />

          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount}</span>
          )}
        </div>

        <div
          className="profile-wrapper"
          onClick={() => navigate("/dashboard/profile")}
          title="View Profile"
        >
          <CgProfile size={30} className="profile-icon" />
        </div>

        {/* Notification Dropdown */}
        {dropdownOpen && (
          <div className="notif-dropdown">
            <h4 className="notif-title">Recent Notifications</h4>

            {notifications.length === 0 ? (
              <p className="notif-empty">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className="notif-card"
                >
                  <p className="notif-text">
                    {notification.message}
                  </p>
                  <p className="notif-time">
                    {notification.updatedAt
                      ? new Date(
                          notification.updatedAt
                        ).toLocaleString()
                      : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    )}
  </div>
);
}