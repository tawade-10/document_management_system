import React,{useEffect,useState} from "react";
import {useNavigate,useParams} from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";
import {FaLock,FaEdit} from "react-icons/fa";
import "./ViewUser.css";

export default function ViewUser(){

    const {userId}=useParams();
    const navigate=useNavigate();
    const token=localStorage.getItem("token");

    const [loading,setLoading]=useState(true);
    const [user,setUser]=useState(null);

    useEffect(()=>{
        fetchUser();
    },[]);

    const fetchUser=async()=>{
        try{
            const response=await axios.get(
                `http://localhost:8080/api/users/${userId}`,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );
            setUser(response.data);
        }catch{
            toast.error("Unable to load user.");
        }finally{
            setLoading(false);
        }
    };

    const handleUpdate=async()=>{
        try{
            await axios.put(
                `http://localhost:8080/api/users/update`,
                {
                    userName:user.userName,
                    email:user.email
                },
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );
            toast.success("User updated successfully.");
            navigate("/admin");
        }catch{
            toast.error("Unable to update user.");
        }
    };

    if(loading){
        return(
            <div className="view-user-page">
                <div className="view-user-loading">
                    Loading...
                </div>
            </div>
        );
    }

    if(!user){
        return(
            <div className="view-user-page">
                <div className="view-user-loading">
                    User not found.
                </div>
            </div>
        );
    }

    return(
        <div className="view-user-page">
            <div className="view-user-card">
                <div className="view-user-header">
                    <h2>View / Edit User</h2>
                    <p>View user details and update editable information</p>
                </div>

                <div className="view-user-form">

                    <div className="view-user-form-group">
                        <label>User ID</label>
                        <div className="view-user-input-wrapper readonly">
                            <input
                                value={user.userId||""}
                                readOnly
                            />
                            <FaLock className="view-user-field-icon"/>
                        </div>
                    </div>

                    <div className="view-user-form-group">
                        <label>Authority Profile</label>
                        <div className="view-user-input-wrapper readonly">
                            <input
                                value={user.authorityName||""}
                                readOnly
                            />
                            <FaLock className="view-user-field-icon"/>
                        </div>
                    </div>

                    <div className="view-user-form-group">
                        <label>User Name</label>
                        <div className="view-user-input-wrapper editable">
                            <input
                                type="text"
                                value={user.userName||""}
                                onChange={(e)=>
                                    setUser({
                                        ...user,
                                        userName:e.target.value
                                    })
                                }
                            />
                            <FaEdit className="view-user-field-icon"/>
                        </div>
                    </div>

                    <div className="view-user-form-group">
                        <label>Email</label>
                        <div className="view-user-input-wrapper editable">
                            <input
                                type="email"
                                value={user.email||""}
                                onChange={(e)=>
                                    setUser({
                                        ...user,
                                        email:e.target.value
                                    })
                                }
                            />
                            <FaEdit className="view-user-field-icon"/>
                        </div>
                    </div>

                    <div className="view-user-form-group">
                        <label>Status</label>
                        <div className="view-user-input-wrapper readonly">
                            <input
                                value={
                                    user.status==="UAC"
                                        ?"Active"
                                        :"Inactive"
                                }
                                readOnly
                            />
                            <FaLock className="view-user-field-icon"/>
                        </div>
                    </div>

                    <div className="view-user-actions">
                        <button
                            type="button"
                            className="view-user-save-btn"
                            onClick={handleUpdate}
                        >
                            Save Changes
                        </button>

                        <button
                            type="button"
                            className="view-user-cancel-btn"
                            onClick={()=>navigate("/admin")}
                        >
                            Cancel
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}