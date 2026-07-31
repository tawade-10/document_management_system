import React from "react";
import "./AdminHomePage.css";
import UsersTable from "../UsersTable/UsersTable";

export default function AdminHomePage() {
    return (
        <div className="admin-home-container">
            <UsersTable />
        </div>
    );
}