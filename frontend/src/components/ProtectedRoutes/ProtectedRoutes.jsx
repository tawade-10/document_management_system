import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({ children, allowedRoles = [] }) {

    const token = localStorage.getItem("token");
    const currentRole = localStorage.getItem("currentRole");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(currentRole)
    ) {
        return <Navigate to="/unauthorized" replace />;
    }
    return children;
}