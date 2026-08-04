import React,{useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
import {FaUser,FaLock,FaEye,FaEyeSlash} from "react-icons/fa";
import {MdEmail} from "react-icons/md";
import "./AddUser.css";

const API_URL="http://localhost:8080/api/auth";

export default function AddUser(){

    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);

    const navigate = useNavigate();

    const [formData,setFormData]=useState({
        userName:"",
        email:"",
        password:"",
        confirmPassword:"",
        authorityId:""
    });

    const [errors,setErrors]=useState({});

    const handleChange=(e)=>{
        const{name,value}=e.target;
        setFormData({
            ...formData,
            [name]:value
        });
        setErrors({
            ...errors,
            [name]:""
        });
    };

    const validate=()=>{
        let temp={};

        if(!formData.userName.trim()){
            temp.userName="User Name is required";
        }

        if(!formData.email.trim()){
            temp.email="Email is required";
        }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)){
            temp.email="Invalid Email Address";
        }

        if(!formData.password.trim()){
            temp.password="Password is required";
        }

        if(!formData.confirmPassword.trim()){
            temp.confirmPassword="Confirm Password is required";
        }

        if(formData.password!==formData.confirmPassword){
            temp.confirmPassword="Passwords do not match";
        }

        if(!formData.authorityId){
            temp.authorityId="Please select Authority";
        }

        setErrors(temp);
        return Object.keys(temp).length===0;
    };

    const handleReset=()=>{
        setFormData({
            userName:"",
            email:"",
            password:"",
            confirmPassword:"",
            authorityId:""
        });
        setErrors({});
    };

    const handleSubmit = async () => {

        if (!validate()) return;

        const token = localStorage.getItem("token");

        const payload = {
            userName: formData.userName,
            email: formData.email,
            password: formData.password,
            authorityId: formData.authorityId
        };

        try {
            console.log("Request");
            console.log({
                method: "POST",
                url: `${API_URL}/register`,
                payload
            });

            const response = await axios.post(
                `${API_URL}/register`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log("Response");
            console.log(response.data);
            console.groupEnd();
            toast.success("User Created Successfully");
            handleReset();
            navigate("/admin",{
                state:{
                    refresh:true
                }
            });
        } catch (error) {
            console.log(error.response?.data);
            console.groupEnd();
            toast.error(
                error.response?.data?.message ||
                "Unable to Create User"
            );
        }
    };

    return(
        <div className="add-user-container">
            <div className="add-user-card">
                <h2>Add User</h2>
                <div className="input-box">
                    <FaUser/>
                    <input
                        type="text"
                        name="userName"
                        placeholder="Enter User Name"
                        value={formData.userName}
                        onChange={handleChange}
                    />
                </div>
                <span className="error">{errors.userName}</span>
                <div className="input-box">
                    <MdEmail/>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <span className="error">{errors.email}</span>
                <div className="input-box">
                    <FaLock/>
                    <input
                        type={showPassword?"text":"password"}
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <span onClick={()=>setShowPassword(!showPassword)}>
                        {showPassword?<FaEyeSlash/>:<FaEye/>}
                    </span>
                </div>
                <span className="error">{errors.password}</span>
                <div className="input-box">
                    <FaLock/>
                    <input
                        type={showConfirmPassword?"text":"password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <span onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword?<FaEyeSlash/>:<FaEye/>}
                    </span>
                </div>
                <span className="error">{errors.confirmPassword}</span>
                <select
                    name="authorityId"
                    value={formData.authorityId}
                    onChange={handleChange}
                >
                    <option value="">Select Authority Profile</option>
                    <option value="0001">0001 - ADMIN,SUPER_USER,USER</option>
                    <option value="0002">0002 - SUPER_USER,USER</option>
                    <option value="0003">0003 - ADMIN</option>
                    <option value="0004">0004 - ADMIN,USER</option>
                    <option value="0005">0005 - USER</option>
                </select>
                <span className="error">{errors.authorityId}</span>
                <div className="button-group">
                    <button
                        type="button"
                        className="reset-btn"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        className="submit-btn"
                        onClick={handleSubmit}
                    >
                        Add User
                    </button>
                </div>
            </div>
        </div>
    );
}