import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UsersTable.css";

export default function UsersTable({ searchKeyword }) {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, [searchKeyword]);

   const fetchUsers = async () => {

       try {
           const token = localStorage.getItem("token");
           let url = "http://localhost:8080/api/users";
           if (searchKeyword.trim() !== "") {
               url =
                   `http://localhost:8080/api/search/users?keyword=${encodeURIComponent(searchKeyword)}`;
           }
           const response = await axios.get(
               url,
               {
                   headers: {
                       Authorization: `Bearer ${token}`
                   }
               }
           );
           setUsers(response.data);
       } catch (err) {
           console.error(err);
       } finally {
           setLoading(false);
       }
   };

    if (loading) {
        return <div className="text-center mt-4">Loading Users...</div>;
    }

    if (error) {
        return <div className="text-danger text-center mt-4">{error}</div>;
    }

    return (
        <div className="users-table-container">
            <table className="table align-middle">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Authority</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>{user.userName}</td>
                                <td>{user.email}</td>
                                <td>{user.authorityName}</td>
                                <td>
                                    <span
                                        className={
                                            user.status === "UAC"
                                                ? "status-badge active"
                                                : "status-badge inactive"
                                        }
                                    >
                                        {user.status === "UAC"
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                No Users Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}