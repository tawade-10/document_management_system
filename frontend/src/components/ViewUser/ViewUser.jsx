import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaLock, FaEdit } from "react-icons/fa";
import "./ViewUser.css";

export default function ViewUser() {

    const { userId } = useParams();

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {

        try {

            const response = await axios.get(
                `http://localhost:8080/api/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUser(response.data);

        }
        catch {

            toast.error("Unable to load user.");

        }
        finally {

            setLoading(false);

        }

    };

    const handleUpdate = async () => {

        try {

            await axios.put(
                `http://localhost:8080/api/users/update`,
                {
                    userName: user.userName,
                    email: user.email
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("User updated successfully.");

            navigate("/admin");

        }
        catch {

            toast.error("Unable to update user.");

        }

    };

    if (loading) {

        return <h2 className="loading">Loading...</h2>;

    }

    return (

        <div className="view-user-container">

            <div className="view-user-card">

                <h2>View / Edit User</h2>

               <div className="form-group">

                   <label>User ID</label>

                   <div className="input-wrapper readonly">

                       <input
                           value={user.userId}
                           readOnly
                       />

                       <FaLock className="field-icon"/>

                   </div>

               </div>

                <div className="form-group">

                    <label>Authority Profile</label>

                    <div className="input-wrapper readonly">

                        <input
                            value={user.authorityName}
                            readOnly
                        />

                        <FaLock className="field-icon"/>

                    </div>

                </div>

               <div className="form-group">

                   <label>User Name</label>

                   <div className="input-wrapper editable">

                       <input
                           value={user.userName}
                           onChange={(e)=>
                               setUser({
                                   ...user,
                                   userName:e.target.value
                               })
                           }
                       />

                       <FaEdit className="field-icon"/>

                   </div>

               </div>

                <div className="form-group">

                    <label>Email</label>

                    <div className="input-wrapper editable">

                        <input
                            value={user.email}
                            onChange={(e)=>
                                setUser({
                                    ...user,
                                    email:e.target.value
                                })
                            }
                        />

                        <FaEdit className="field-icon"/>

                    </div>

                </div>
                <div className="form-group">

                    <label>Status</label>

                    <div className="input-wrapper readonly status-box">

                        <input
                            value={user.status === "UAC" ? "Active" : "Inactive"}
                            readOnly
                        />

                        <FaLock className="field-icon"/>

                    </div>

                </div>
                <button
                    className="save-btn"
                    onClick={handleUpdate}
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}

