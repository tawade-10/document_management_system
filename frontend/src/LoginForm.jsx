import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./App.css";

const API_URL = "http://localhost:8080/api/auth";

export default function Login() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: ""
        });
    };

    const validate = () => {
        let temp = {};
        if (!loginData.email.trim()) {
            temp.email = "Email is required";
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(loginData.email)
        ) {
            temp.email = "Invalid Email Address";
        }
        if (!loginData.password.trim()) {
            temp.password = "Password is required";
        }
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const handleReset = () => {
        setLoginData({
            email: "",
            password: ""
        });
        setErrors({});
    };

    const storeUserData = (data, currentRole) => {

        const authorityString =
            (data.authorityName || "").toUpperCase().trim();

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.userName);
        localStorage.setItem("email", data.email);
        localStorage.setItem("authority", authorityString);
        localStorage.setItem("currentRole", currentRole);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);
            console.log("Request");
            console.log({
                method: "POST",
                url: `${API_URL}/login`,
                payload: loginData
            });

            const response = await axios.post(
                `${API_URL}/login`,
                loginData
            );

            console.log("Response");
            console.log({
                status: response.status,
                payload: response.data
            });

            console.groupEnd();

            const data = response.data;
            const authority = (data.authorityName || "").toUpperCase().trim();

            if (
                authority.includes("USER") ||
                authority.includes("SUPER_USER")
            ) {
                storeUserData(data, "USER");
                window.dispatchEvent(new Event("login"));
                toast.success("Login Successful");
                navigate("/user-homepage");
            } else {
                toast.error(
                    "You are not authorized to access the User Portal."
                );
            }

        } catch (error) {

            console.log("Login API Error");

            if (error.response) {

                console.log({
                    status: error.response.status,
                    payload: error.response.data
                });

                toast.error(
                    error.response.data.message ||
                    "Invalid Email or Password"
                );

            } else {

                console.log(error.message);
                toast.error("Server not responding");

            }

            console.groupEnd();

        } finally {
            setLoading(false);
        }
    };

 const handleAdminLogin = async (e) => {

     e.preventDefault();

     if (!validate()) return;

     try {
         setLoading(true);
         const response = await axios.post(
             `${API_URL}/login`,
             loginData
         );
         const data = response.data;
         console.log("Login Response");
         console.log(data);
         const authority = (data.authorityName || "")
             .toUpperCase()
             .trim();
         console.log("Authority :", authority);
         const roles = authority
             .split(",")
             .map(role => role.trim());
         console.log("Roles :", roles);
         if (roles.includes("ADMIN")) {
             console.log("ADMIN LOGIN");
             storeUserData(data,"ADMIN");
             window.dispatchEvent(new Event("login"));
             navigate("/admin");
         } else {
             console.log("NOT ADMIN");
             toast.error("You are not authorized to access Admin Control.");
         }
     } catch (error) {
         console.log(error);
     } finally {
         setLoading(false);
     }
 };

    return (
        <div className="container">
            <div className="form-container">
                <div className="form">
                    <h2>User Login</h2>
                    <div className="email-field">
                        <span className="email-icon">
                            <MdEmail />
                        </span>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your Email"
                            value={loginData.email}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.email &&
                        <span className="error">
                            {errors.email}
                        </span>
                    }
                    <div className="password-field">
                        <span className="lock-icon">
                            <FaLock />
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your Password"
                            value={loginData.password}
                            onChange={handleChange}
                        />
                        <span
                            className="password-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {
                                showPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                            }
                        </span>
                    </div>
                    {errors.password &&
                        <span className="error">
                            {errors.password}
                        </span>
                    }
                    <div className="reset-links">
                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>
                        <span
                            className="reset-btn"
                            onClick={handleReset}
                        >
                            Reset Fields
                        </span>
                    </div>
                    <button
                        className="primary-btn"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Please Wait..."
                                : "Login"
                        }
                    </button>
                    <div className="admin-control-wrapper">
                        <button
                            className="admin-control-btn"
                            onClick={handleAdminLogin}
                            disabled={loading}
                        >
                            Admin Control
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}