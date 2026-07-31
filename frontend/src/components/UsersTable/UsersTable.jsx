import React from "react";
import "./UsersTable.css";

export default function UsersTable() {

    const users = [
        {
            id: "U0001",
            name: "John Doe",
            email: "john.doe@example.com",
            role: "Admin",
            authority: "ROOT_ADMIN",
            status: "Active"
        },
        {
            id: "U0002",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            role: "User",
            authority: "USER",
            status: "Active"
        },
        {
            id: "U0003",
            name: "Robert Johnson",
            email: "robert.johnson@example.com",
            role: "Super User",
            authority: "SUPER_USER",
            status: "Inactive"
        },
        {
            id: "U0004",
            name: "Emily Davis",
            email: "emily.davis@example.com",
            role: "User",
            authority: "USER",
            status: "Active"
        },
        {
            id: "U0005",
            name: "Michael Brown",
            email: "michael.brown@example.com",
            role: "Admin",
            authority: "ADMIN",
            status: "Inactive"
        }
    ];

    return (
        <div className="users-table-container">
            <table className="table table-hover table-bordered align-middle">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Authority</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.authority}</td>
                            <td>
                                <span
                                    className={
                                        user.status === "Active"
                                            ? "status-badge active"
                                            : "status-badge inactive"
                                    }
                                >
                                    {user.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}